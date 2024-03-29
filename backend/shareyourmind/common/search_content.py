from django.core.exceptions import FieldError
from django.db.models import Q, Count, Sum
from rest_framework import generics, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny

from shareyourmind.blog_posts.models import BlogPost
from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.common.content_types_constants import OBJECT_CONTENT_TYPES
from shareyourmind.common.utils import get_category_choices
from shareyourmind.polls.models import Poll
from shareyourmind.questions.models import Question
from shareyourmind.users.api.serializers import UserSerializer

ORDER_BY_MAP = {
    "created_at": "created_at",
    "updated_at": "updated_at",
    "likes": "likes",
    "answers": "answers_count",
    "comments": "comments_count",
    "votes": "votes_count",
}


class SearchRequestSerializer(serializers.Serializer):
    category_choices = get_category_choices()

    object_content_type = serializers.ChoiceField(choices=OBJECT_CONTENT_TYPES)
    is_recommended = serializers.BooleanField(required=False)
    category = serializers.ListSerializer(
        required=False, child=serializers.ChoiceField(choices=category_choices)
    )
    order_by = serializers.ListSerializer(
        required=False,
        child=serializers.ChoiceField(
            choices=[f"-{order_by}" for order_by in ORDER_BY_MAP.keys()]
            + [order_by for order_by in ORDER_BY_MAP.keys()]
        ),
    )
    query = serializers.CharField(required=False)

    def validate(self, attrs):
        if any([a == [] for a in attrs.values()]):
            raise serializers.ValidationError("Parameter list cannot be empty!")
        return attrs


class MetadataItemSerializer(serializers.Serializer):
    id = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    author = UserSerializer()
    image_url = serializers.SerializerMethodField(required=False)
    heading = serializers.CharField(required=False)
    title = serializers.CharField(required=False)
    short_description = serializers.SerializerMethodField(required=False)
    short_content = serializers.SerializerMethodField(required=False)
    likes = serializers.IntegerField(required=False)
    votes = serializers.IntegerField(required=False)
    number_of_answers = serializers.SerializerMethodField(required=False)
    number_of_comments = serializers.SerializerMethodField(required=False)
    categories = CategorySerializer(many=True)

    def get_image_url(self, obj):
        if getattr(obj, "image", None):
            image_url = obj.image_url
            return self.context["request"].build_absolute_uri(image_url)

    def get_short_description(self, obj):
        if hasattr(obj, "short_description"):
            return obj.short_description

    def get_short_content(self, obj):
        if hasattr(obj, "short_content"):
            return obj.short_content

    def get_number_of_answers(self, obj):
        if hasattr(obj, "number_of_answers"):
            return obj.number_of_answers

    def get_number_of_comments(self, obj):
        if hasattr(obj, "number_of_comments"):
            return obj.number_of_comments


class SearchAPIView(generics.CreateAPIView):
    request_serializer = SearchRequestSerializer
    item_serializer = MetadataItemSerializer
    order_by_map = ORDER_BY_MAP

    permission_classes = [AllowAny]
    pagination_class = PageNumberPagination

    def post(self, request, *args, **kwargs):
        serializer = self.request_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        search_data = serializer.validated_data

        if not search_data:
            raise serializers.ValidationError(
                {"error": "At least one parameter required."}
            )

        result_qs = self.get_result_queryset(search_data, self.order_by_map)
        paginated_result_qs = self.paginate_queryset(result_qs)

        result_data = self.item_serializer(
            instance=paginated_result_qs,
            many=True,
            context=self.get_serializer_context(),
        ).data
        return self.get_paginated_response(data=result_data)

    def get_result_queryset(self, search_data, order_by_map):
        user = self.request.user
        object_content_type = search_data.pop("object_content_type")
        search_categories = search_data.pop("category", [])
        is_recommended = search_data.pop("is_recommended", False)
        query = search_data.pop("query", None)
        order_by_fields = search_data.pop("order_by", [])

        use_questions = False
        use_blog_posts = False
        use_polls = False
        if object_content_type == Question.OBJECT_CONTENT_TYPE:
            use_questions = True
        elif object_content_type == BlogPost.OBJECT_CONTENT_TYPE:
            use_blog_posts = True
        elif object_content_type == Poll.OBJECT_CONTENT_TYPE:
            use_polls = True
        else:
            raise NotImplementedError

        if is_recommended:
            if search_categories:
                search_categories = set(search_categories)
                favourite_categories = set(user.favourite_categories_names)
                total_categories = favourite_categories.intersection(search_categories)
            else:
                total_categories = user.favourite_categories_names
        else:
            total_categories = search_categories if search_categories else None

        filter_expression = Q()
        if total_categories is not None:
            total_categories = list(set(total_categories))
            filter_expression &= Q(categories__name__in=total_categories)

        if query:
            if use_questions:
                filter_expression &= Q(heading__icontains=query) | Q(
                    description__icontains=query
                )
            elif use_blog_posts:
                filter_expression &= Q(title__icontains=query) | Q(
                    content__icontains=query
                )
            elif use_polls:
                filter_expression &= Q(heading__icontains=query)

        order_by = []
        for order_by_field in order_by_fields:
            field = order_by_field.split("-")[-1]
            value = order_by_map.get(field, None)

            if not value:
                raise serializers.ValidationError({"order_by": "Illegal key used."})

            if order_by_field.startswith("-"):
                order_by.append("-" + value)
            else:
                order_by.append(value)

        if "updated_at" not in order_by and "-updated_at" not in order_by:
            order_by.append("-updated_at")

        result = []
        if use_questions:
            result = Question.objects.all()
            if "answers" in order_by_fields or "-answers" in order_by_fields:
                result = Question.objects.all().annotate(
                    **{order_by_map["answers"]: Count("answers")}
                )
        elif use_blog_posts:
            result = BlogPost.objects.all()
            if "comments" in order_by_fields or "-comments" in order_by_fields:
                result = BlogPost.objects.all().annotate(
                    **{order_by_map["comments"]: Count("comments")}
                )
        elif use_polls:
            result = Poll.objects.all()
            if "votes" in order_by_fields or "-votes" in order_by_fields:
                result = Poll.objects.all().annotate(
                    **{order_by_map["votes"]: Sum("answers__votes")}
                )
            if "comments" in order_by_fields or "-comments" in order_by_fields:
                result = Poll.objects.all().annotate(
                    **{order_by_map["comments"]: Count("comments")}
                )

        result = (
            result.filter(filter_expression).distinct().prefetch_related("categories")
        )
        if order_by:
            try:
                result = result.order_by(*order_by)
            except FieldError:
                raise serializers.ValidationError({"order_by": "Illegal key used."})

        return result
