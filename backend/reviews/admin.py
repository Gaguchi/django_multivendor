from django.contrib import admin
from .models import Review, ReviewMedia

class ReviewMediaInline(admin.TabularInline):
    model = ReviewMedia
    extra = 1
    fields = ['file', 'media_type']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['comment', 'user__username', 'product__name']
    inlines = [ReviewMediaInline]

@admin.register(ReviewMedia)
class ReviewMediaAdmin(admin.ModelAdmin):
    list_display = ['id', 'review', 'media_type', 'created_at', 'get_file_size']
    list_filter = ['media_type', 'created_at']