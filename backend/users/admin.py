from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Address

# Define inline admin for UserProfile
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

# Define Address admin with list display and filters
class AddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'address_type', 'is_default', 'city', 'country')
    list_filter = ('is_default', 'address_type', 'city', 'country')
    search_fields = ('full_name', 'user__username', 'address_line1', 'city')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'full_name', 'email', 'phone_number')
        }),
        ('Address Type', {
            'fields': ('address_type', 'is_default')
        }),
        ('Address Details', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country')
        }),
        ('Building Access', {
            'fields': ('apartment_number', 'entrance_number', 'floor', 'door_code'),
            'classes': ('collapse',),
        }),
        ('Additional Information', {
            'fields': ('delivery_instructions', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

# Extend the UserAdmin to include UserProfile information
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_user_type', 'is_staff')
    list_select_related = ('userprofile', )

    def get_user_type(self, instance):
        try:
            return instance.userprofile.get_user_type_display()
        except UserProfile.DoesNotExist:
            return '-'
    get_user_type.short_description = 'User Type'
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(UserAdmin, self).get_inline_instances(request, obj)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Register Address model
admin.site.register(Address, AddressAdmin)

# Register UserProfile if standalone access is needed
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'first_name', 'last_name', 'phone')
    list_filter = ('user_type',)
    search_fields = ('user__username', 'first_name', 'last_name', 'phone')