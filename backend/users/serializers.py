from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile, Address, Wishlist
# Remove the circular import from vendors.serializers

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
