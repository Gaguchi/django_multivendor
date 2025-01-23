from rest_framework import serializers
from .models import Vendor, Product
from users.models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'first_name', 'last_name', 'phone', 'address']

class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'userprofile']

    def create(self, validated_data):
        userprofile_data = validated_data.pop('userprofile')
        user = User.objects.create(**validated_data)
        UserProfile.objects.create(user=user, **userprofile_data)
        return user

class VendorSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer()

    class Meta:
        model = Vendor
        fields = ['id', 'user_profile', 'shop_name', 'shop_description']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
