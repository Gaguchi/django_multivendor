from django.contrib import admin
from .models import Review, ReviewImage, ReviewVideo


class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0


class ReviewVideoInline(admin.TabularInline):
    model = ReviewVideo
    extra = 0


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'product']
    search_fields = ['user__username', 'product__name', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ReviewImageInline, ReviewVideoInline]


@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'review', 'image', 'created_at']
    list_filter = ['created_at']


@admin.register(ReviewVideo)  
class ReviewVideoAdmin(admin.ModelAdmin):
    list_display = ['id', 'review', 'video', 'duration', 'created_at']
    list_filter = ['created_at']