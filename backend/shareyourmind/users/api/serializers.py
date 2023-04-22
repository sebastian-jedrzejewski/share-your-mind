from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from shareyourmind.common.models import Category
from shareyourmind.users.models import User


class CustomUserCreateSerializer(UserCreateSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta(UserCreateSerializer.Meta):
        fields = UserCreateSerializer.Meta.fields + (
            "password2",
            "first_name",
            "last_name",
        )

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.pop("password2")
        if password != password2:
            raise serializers.ValidationError(
                {"password": "Passwords must be identical!"}
            )
        return super().validate(attrs)


class CurrentUserSerializer(UserSerializer):
    favourite_categories_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        source="favourite_categories",
        many=True,
    )

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + (
            "first_name",
            "last_name",
            "favourite_categories_id"
        )

    def update(self, instance, validated_data):
        favourite_categories_id = validated_data.pop("favourite_categories_id", None)
        if favourite_categories_id:
            instance.favourite_categories.set(favourite_categories_id)
        return super().update(instance, validated_data)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {"bad_token": "The token is invalid or expired."}

    def validate(self, attrs):
        self.token = attrs["refresh"]
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail("bad_token")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "username", "first_name", "last_name")
