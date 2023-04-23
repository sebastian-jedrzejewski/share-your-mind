from rest_framework import generics
from rest_framework.permissions import AllowAny

from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.common.models import Category


class CategoryView(
    generics.ListAPIView, generics.RetrieveAPIView, generics.GenericAPIView
):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by("name")

    def get(self, request, *args, **kwargs):
        if "pk" in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
