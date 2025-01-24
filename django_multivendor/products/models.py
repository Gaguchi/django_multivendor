from django.db import models
from vendors.models import Vendor

class Product(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # ...add more fields as needed...

    def __str__(self):
        return self.name
