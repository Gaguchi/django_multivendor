from rest_framework import serializers
from django.core.validators import FileExtensionValidator
from .models import Review, ReviewMedia

class ReviewMediaSerializer(serializers.ModelSerializer):
    """Serializer for review media (images/videos)"""
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ReviewMedia
        fields = ['id', 'file', 'media_type', 'file_url', 'created_at']
        read_only_fields = ['created_at']
        extra_kwargs = {
            'file': {
                'required': True,
                'help_text': 'Upload image or video file',
            }
        }
    
    def get_file_url(self, obj):
        """Return the complete URL to the file"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def validate_file(self, value):
        """Validate file type and size"""
        # Get media type from data
        media_type = self.initial_data.get('media_type', 'image')
        
        # Validate file extension based on media type
        if media_type == 'image':
            # Allow common image formats
            validator = FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'webp'])
            validator(value)
            
            # Check file size (limit to 5MB for images)
            if value.size > 5 * 1024 * 1024:  # 5MB in bytes
                raise serializers.ValidationError("Image size cannot exceed 5MB")
                
        elif media_type == 'video':
            # Allow common video formats
            validator = FileExtensionValidator(allowed_extensions=['mp4', 'webm', 'mov'])
            validator(value)
            
            # Check file size (limit to 50MB for videos)
            if value.size > 50 * 1024 * 1024:  # 50MB in bytes
                raise serializers.ValidationError("Video size cannot exceed 50MB")
        
        return value

class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for product reviews with media"""
    user_name = serializers.SerializerMethodField()
    media = ReviewMediaSerializer(many=True, read_only=True)
    media_files = serializers.ListField(
        child=serializers.FileField(
            max_length=100000,
            allow_empty_file=False,
            use_url=False
        ),
        write_only=True,
        required=False
    )
    media_types = serializers.ListField(
        child=serializers.ChoiceField(choices=ReviewMedia.MEDIA_TYPE_CHOICES),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_name', 'rating', 'comment', 
                  'created_at', 'updated_at', 'media', 'media_files', 'media_types']
        read_only_fields = ['user', 'created_at', 'updated_at', 'media']
    
    def get_user_name(self, obj):
        """Return the user's full name or username"""
        user = obj.user
        if user.first_name or user.last_name:
            return f"{user.first_name} {user.last_name}".strip()
        return user.username
    
    def validate(self, attrs):
        """Validate media files and types match"""
        media_files = attrs.get('media_files', [])
        media_types = attrs.get('media_types', [])
        
        if media_files and not media_types:
            # Default all files to images if types not specified
            attrs['media_types'] = ['image'] * len(media_files)
        elif media_files and len(media_files) != len(media_types):
            raise serializers.ValidationError({
                'media_types': 'Number of media types must match number of media files'
            })
            
        return attrs
    
    def create(self, validated_data):
        """Create review with media files"""
        media_files = validated_data.pop('media_files', [])
        media_types = validated_data.pop('media_types', [])
        
        # Create review
        review = Review.objects.create(**validated_data)
        
        # Create review media
        for i, file in enumerate(media_files):
            ReviewMedia.objects.create(
                review=review,
                file=file,
                media_type=media_types[i]
            )
        
        return review
    
    def update(self, instance, validated_data):
        """Update review with new media files"""
        media_files = validated_data.pop('media_files', [])
        media_types = validated_data.pop('media_types', [])
        
        # Update review fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Add new media files
        for i, file in enumerate(media_files):
            ReviewMedia.objects.create(
                review=instance,
                file=file,
                media_type=media_types[i]
            )
        
        return instance