from django.db import models
# from vendors.models import Vendor  # Remove or comment this out

# class Product(models.Model):
#     vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
#     name = models.CharField(max_length=100)
#     def product_directory_path(instance, filename):
#         # file will be uploaded to MEDIA_ROOT/products/<vendor>/<product_name>/<filename>
#         return f'products/{instance.vendor.name}/{instance.name}/{filename}'
#
#     thumbnail = models.ImageField(upload_to=product_directory_path, null=True, blank=True)
#     image = models.ImageField(upload_to=product_directory_path, null=True, blank=True)
#     video = models.FileField(upload_to=product_directory_path, null=True, blank=True)
#
#     def __str__(self):
#         return self.name
