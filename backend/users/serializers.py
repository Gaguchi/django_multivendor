from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile, Address

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'first_name', 'last_name', 'phone']

class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'userprofile']

    def create(self, validated_data):
        userprofile_data = validated_data.pop('userprofile', {})
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, **userprofile_data)
        return user

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'is_default', 'full_name', 'phone_number', 
            'email', 'address_line1', 'address_line2', 'city', 'state', 
            'postal_code', 'country', 'apartment_number', 'entrance_number', 
            'floor', 'door_code', 'delivery_instructions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
