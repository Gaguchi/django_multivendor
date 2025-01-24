from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=100)
    # ...add more fields as needed...

    def __str__(self):
        return self.name

# Remove the Product model from here
