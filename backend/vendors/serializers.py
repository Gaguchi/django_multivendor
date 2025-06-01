import logging # Ensure logging is imported
from rest_framework import serializers
from .models import Vendor, VendorProduct, ProductImage

# Import UserSerializer carefully to avoid circular import
from users.serializers import UserSerializer 
from users.models import UserProfile

class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # User will be set from the request

    class Meta:
        model = Vendor
        fields = [
            'id', 'user', 'store_name', 'description', 
            'contact_email', 'phone', 'address', 
            'logo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate(self, data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")

        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.user_type != 'vendor':
                raise serializers.ValidationError("User must be a vendor type")
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("User profile not found")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        vendor = Vendor.objects.create(**validated_data)
        return vendor

class SimpleVendorSerializer(serializers.ModelSerializer):
    """Lightweight serializer for vendor information in product listings"""
    class Meta:
        model = Vendor
        fields = ['id', 'store_name']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'file', 'position']

# Define ProductListSerializer
class ProductListSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.store_name', read_only=True)
    # Assuming VendorProduct has a ForeignKey 'category' to a Category model with a 'name' field.
    # And that Category model is imported or accessible.
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True, default=None)
    images = ProductImageSerializer(many=True, read_only=True, source='product_images') # Added to show images in list

    class Meta:
        model = VendorProduct
        fields = [
            'id', 'name', 'price', 'old_price', 'thumbnail', 'vendor_name', 'rating', 
            'category_name', 'is_hot', 'stock', 'images', 'created_at'
        ]

# Fix: Define the ComboProductSerializer before it's used
class ComboProductSerializer(serializers.ModelSerializer):
    """Simple serializer for products in combos/frequently bought together"""
    vendor_name = serializers.CharField(source='vendor.store_name', read_only=True)
    
    class Meta:
        model = VendorProduct
        fields = [
            'id',
            'name',
            'price',
            'thumbnail',
            'vendor_name',
            'rating',
        ]

class ProductSerializer(serializers.ModelSerializer):
    vendor = SimpleVendorSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True, source='product_images')
    # If category is a ForeignKey and needs to be writable:
    # category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), allow_null=True, required=False) 
    # Ensure Category model is imported if using PrimaryKeyRelatedField

    class Meta:
        model = VendorProduct
        fields = [
            'id', 'name', 'sku', 'price', 'old_price', 'stock', 'description',
            'thumbnail', 'secondaryImage', 'vendor', 'images', 'rating', 'is_hot', 'created_at',
            # 'category' # Add category here if it's part of the model and needs to be serialized
        ]

    def create(self, validated_data):
        """Handle product creation with image uploads - Fixed to prevent thumbnail duplication and set default thumbnail."""
        logger = logging.getLogger(__name__)
        
        request = self.context.get('request')
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            raise serializers.ValidationError("User not authenticated.")

        try:
            vendor = Vendor.objects.get(user=request.user)
        except Vendor.DoesNotExist:
            raise serializers.ValidationError("Vendor profile not found for this user.")
        
        validated_data['vendor'] = vendor
        
        thumbnail_filename_from_request = request.data.get('thumbnail_filename')
        logger.info(f"Thumbnail filename from request: {thumbnail_filename_from_request}")

        # Remove 'thumbnail' from validated_data; we set it manually from ProductImage.
        # This prevents issues if 'thumbnail' was part of the initial validated_data.
        validated_data.pop('thumbnail', None)
        
        # If 'category' is a field expecting an ID, ensure it's correctly handled.
        # Example: if validated_data['category'] is an object, extract id.
        # category_data = validated_data.pop('category', None)
        # if category_data:
        #     try:
        #         category_id = int(category_data) # Or however category is sent
        #         validated_data['category_id'] = category_id
        #     except (ValueError, TypeError):
        #         logger.warning(f"Invalid category data: {category_data}")
        #         # Optionally raise validation error or handle as per business logic

        product = VendorProduct.objects.create(**validated_data)
        logger.info(f"Product base created with ID: {product.id} for vendor ID: {vendor.id}. Validated data used: {validated_data}")
        
        uploaded_image_files = request.FILES.getlist('images[]') # Matches frontend key
        created_product_images = []
        initial_thumbnail_set_for_product = False

        if uploaded_image_files:
            logger.info(f"Processing {len(uploaded_image_files)} uploaded image files for product ID: {product.id}")
            for index, image_file_obj in enumerate(uploaded_image_files):
                product_image = ProductImage.objects.create(
                    product=product,
                    file=image_file_obj,
                    position=index 
                )
                created_product_images.append(product_image)
                logger.info(f"Created ProductImage ID: {product_image.id} with file: {product_image.file.name} for product ID: {product.id}")
        else:
            logger.info(f"No new image files uploaded for product ID: {product.id}")

        designated_thumbnail_product_image = None
        if thumbnail_filename_from_request and created_product_images:
            for pi in created_product_images:
                # Check if original filename (before potential storage renaming) matches
                if pi.file.name.endswith(thumbnail_filename_from_request) or \
                   (hasattr(pi.file.file, 'original_name') and pi.file.file.original_name == thumbnail_filename_from_request) or \
                   (image_file_obj.name == thumbnail_filename_from_request for image_file_obj in uploaded_image_files if image_file_obj.name == thumbnail_filename_from_request): # Check original name if available
                    designated_thumbnail_product_image = pi
                    break
            if designated_thumbnail_product_image:
                logger.info(f"Thumbnail '{thumbnail_filename_from_request}' matches newly uploaded image ID: {designated_thumbnail_product_image.id} for product ID: {product.id}")
            else:
                logger.warning(f"Thumbnail filename '{thumbnail_filename_from_request}' provided but did not match any newly uploaded images for product ID: {product.id}.")

        if designated_thumbnail_product_image:
            product.thumbnail = designated_thumbnail_product_image.file
            initial_thumbnail_set_for_product = True
            logger.info(f"Set product.thumbnail to newly uploaded designated image: {product.thumbnail.name} for product ID: {product.id}")
        elif created_product_images:
            first_uploaded_image = created_product_images[0]
            product.thumbnail = first_uploaded_image.file
            initial_thumbnail_set_for_product = True
            logger.info(f"Set product.thumbnail to the first uploaded image: {product.thumbnail.name} for product ID: {product.id}")
        else:
            logger.info(f"No new images uploaded or no specific thumbnail designated from new uploads. Product.thumbnail not set from new uploads for product ID: {product.id}.")

        if initial_thumbnail_set_for_product:
            product.save(update_fields=['thumbnail'])
            logger.info(f"Saved product thumbnail for product ID: {product.id}")
        
        return product

    def update(self, instance, validated_data):
        """Handle product updates with image uploads"""
        import logging # Ensure logging is available in update too
        logger = logging.getLogger(__name__)
        from django.db import models # Import models here

        request = self.context.get('request')
        
        # Update basic product fields
        # Pop images and thumbnail_filename from validated_data as they are not direct model fields or handled separately
        validated_data.pop('images', None) 
        validated_data.pop('thumbnail_filename', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save() # Save main attribute changes
        logger.info(f"Product instance (ID: {instance.id}) updated with basic fields.")
        
        # Handle new image uploads from request.FILES
        if request and request.FILES:
            uploaded_image_files = request.FILES.getlist('images')
            thumbnail_filename_from_request = request.data.get('thumbnail_filename')
            logger.info(f"Processing {len(uploaded_image_files)} new image files for update. Designated thumbnail filename: '{thumbnail_filename_from_request}'")
            
            max_position = ProductImage.objects.filter(product=instance).aggregate(
                models.Max('position')
            )['position__max'] or -1
            
            newly_designated_thumbnail_image = None # To track if a new upload becomes the thumbnail
            
            for index, image_file_obj in enumerate(uploaded_image_files):
                logger.info(f"Processing new image file {index} for update: {image_file_obj.name}, size: {image_file_obj.size}")
                product_image_instance = ProductImage.objects.create(
                    product=instance,
                    file=image_file_obj,
                    position=max_position + index + 1,
                    alt_text=f"Image {max_position + index + 2} for {instance.name}"
                )
                logger.info(f"Created new ProductImage with ID: {product_image_instance.id}, File path: {product_image_instance.file.name}")

                if thumbnail_filename_from_request and image_file_obj.name == thumbnail_filename_from_request:
                    newly_designated_thumbnail_image = product_image_instance
                    logger.info(f"Newly uploaded image '{image_file_obj.name}' (ID: {product_image_instance.id}) is designated as thumbnail.")
            
            # If a newly uploaded image was designated as thumbnail, update product.thumbnail
            if newly_designated_thumbnail_image:
                instance.thumbnail = newly_designated_thumbnail_image.file
                instance.save(update_fields=['thumbnail']) # Save only the thumbnail field
                logger.info(f"Updated product.thumbnail to: {instance.thumbnail.name} (from new ProductImage ID: {newly_designated_thumbnail_image.id})")
            elif thumbnail_filename_from_request:
                # If thumbnail_filename was provided but didn't match a new upload,
                # check if it matches an existing image.
                try:
                    existing_image_as_thumbnail = instance.product_images.get(file__endswith=thumbnail_filename_from_request)
                    instance.thumbnail = existing_image_as_thumbnail.file
                    instance.save(update_fields=['thumbnail'])
                    logger.info(f"Updated product.thumbnail to existing image: {instance.thumbnail.name} (ProductImage ID: {existing_image_as_thumbnail.id})")
                except ProductImage.DoesNotExist:
                    logger.warning(f"Thumbnail filename '{thumbnail_filename_from_request}' provided but did not match any new or existing images for product ID {instance.id}.")
                except ProductImage.MultipleObjectsReturned:
                    logger.error(f"Multiple existing images found matching filename '{thumbnail_filename_from_request}' for product ID {instance.id}. Thumbnail not changed.")


        elif thumbnail_filename_from_request: # No new files, but thumbnail_filename might refer to an existing image
            logger.info(f"No new files uploaded, but thumbnail_filename '{thumbnail_filename_from_request}' was provided. Checking existing images.")
            try:
                existing_image_as_thumbnail = instance.product_images.get(file__endswith=thumbnail_filename_from_request)
                if instance.thumbnail != existing_image_as_thumbnail.file: # Only update if different
                    instance.thumbnail = existing_image_as_thumbnail.file
                    instance.save(update_fields=['thumbnail'])
                    logger.info(f"Updated product.thumbnail to existing image: {instance.thumbnail.name} (ProductImage ID: {existing_image_as_thumbnail.id})")
                else:
                    logger.info(f"Product.thumbnail already set to '{existing_image_as_thumbnail.file.name}'. No change needed.")
            except ProductImage.DoesNotExist:
                logger.warning(f"Thumbnail filename '{thumbnail_filename_from_request}' provided but did not match any existing images for product ID {instance.id}.")
            except ProductImage.MultipleObjectsReturned:
                logger.error(f"Multiple existing images found matching filename '{thumbnail_filename_from_request}' for product ID {instance.id}. Thumbnail not changed.")
        
        return instance
