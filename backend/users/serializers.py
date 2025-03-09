from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile, Address, Wishlist

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'first_name', 'last_name', 'phone']

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

    def create(self, validated_data):
        # Extract profile fields from top-level data
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        phone = validated_data.pop('phone', '')
        
        # Get or initialize userprofile data
        userprofile_data = validated_data.pop('userprofile', {})
        
        # Update profile data with any top-level profile fields
        if first_name and 'first_name' not in userprofile_data:
            userprofile_data['first_name'] = first_name
        if last_name and 'last_name' not in userprofile_data:
            userprofile_data['last_name'] = last_name
        if phone and 'phone' not in userprofile_data:
            userprofile_data['phone'] = phone
            
        # Create user with remaining data
        user = User.objects.create_user(
            username=validated_data.get('username', validated_data['email']),
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        
        # Update or create profile (instead of always creating)
        try:
            # If profile exists (due to signals), update it
            if hasattr(user, 'userprofile'):
                for key, value in userprofile_data.items():
                    setattr(user.userprofile, key, value)
                user.userprofile.save()
            else:
                # Create profile if it doesn't exist
                UserProfile.objects.create(user=user, **userprofile_data)
        except Exception as e:
            # If there's any error with profile creation, log it but don't fail
            print(f"Error updating profile: {e}")
            
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
