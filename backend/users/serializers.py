from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile, Address, Wishlist
from django.contrib.auth import authenticate
from django.db import transaction, IntegrityError
import logging

logger = logging.getLogger(__name__)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'first_name', 'last_name', 'phone']

class EmailAuthSerializer(serializers.Serializer):
    """
    Serializer for authenticating users with either username or email
    """
    login = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        login = data.get('login')
        password = data.get('password')

        if not login or not password:
            raise serializers.ValidationError("Both login and password are required.")

        # First try to authenticate with the provided value as username
        user = authenticate(username=login, password=password)
        
        # If that fails and the login looks like an email, try with email
        if user is None and '@' in login:
            try:
                # Find the user with this email
                user_obj = User.objects.get(email=login)
                # Then authenticate with their username
                user = authenticate(username=user_obj.username, password=password)
                logger.info(f"User authenticated via email: {login}")
            except User.DoesNotExist:
                logger.warning(f"Failed login attempt with email: {login}")
                pass

        if user is None:
            logger.warning(f"Failed login attempt: {login}")
            raise serializers.ValidationError("Unable to log in with provided credentials.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        return {
            'user': user
        }

class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, write_only=True)
    last_name = serializers.CharField(required=False, write_only=True)
    phone = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'userprofile', 'first_name', 'last_name', 'phone']

    def validate_email(self, value):
        """Check if email already exists"""
        value = value.lower().strip()  # Normalize email
        
        # For updates, exclude the current user
        user_id = self.instance.id if self.instance else None
        queryset = User.objects.filter(email=value)
        if user_id:
            queryset = queryset.exclude(id=user_id)
            
        if queryset.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """Check if username already exists"""
        if value:
            value = value.strip()
            # For updates, exclude the current user
            user_id = self.instance.id if self.instance else None
            queryset = User.objects.filter(username=value)
            if user_id:
                queryset = queryset.exclude(id=user_id)
                
            if queryset.exists():
                raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        # Extract profile fields from top-level data
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        phone = validated_data.pop('phone', '')
        userprofile_data = validated_data.pop('userprofile', {})
        if first_name and 'first_name' not in userprofile_data:
            userprofile_data['first_name'] = first_name
        if last_name and 'last_name' not in userprofile_data:
            userprofile_data['last_name'] = last_name
        if phone and 'phone' not in userprofile_data:
            userprofile_data['phone'] = phone
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=validated_data.get('username', validated_data['email']),
                    email=validated_data.get('email'),
                    password=validated_data['password']
                )
                # Update or create profile (instead of always creating)
                if hasattr(user, 'userprofile'):
                    for key, value in userprofile_data.items():
                        setattr(user.userprofile, key, value)
                    user.userprofile.save()
                else:
                    UserProfile.objects.create(user=user, **userprofile_data)
        except IntegrityError as e:
            if 'unique constraint' in str(e).lower() or 'unique violation' in str(e).lower():
                raise serializers.ValidationError({'email': 'A user with this email or username already exists.'})
            raise
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

class WishlistSerializer(serializers.ModelSerializer):
    # Use a different approach to avoid circular imports
    product = serializers.SerializerMethodField()
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'added_at']
        read_only_fields = ['id', 'added_at']
    
    def get_product(self, obj):
        # Dynamically import to avoid circular dependency
        from vendors.serializers import ProductSerializer
        return ProductSerializer(obj.product).data
    
    def create(self, validated_data):
        # Extract user from the context, not from validated_data
        user = self.context['request'].user
        product_id = validated_data.pop('product_id')
        
        # Check if the item is already in the wishlist
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user,
            product_id=product_id
        )
        
        return wishlist_item
