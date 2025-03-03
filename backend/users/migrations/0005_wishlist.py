from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('vendors', '0001_initial'),  # Changed from 'products' to 'vendors'
        ('users', '0004_address'),  # Adjust based on your last migration
    ]

    operations = [
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='in_wishlists', to='vendors.vendorproduct')),  # Changed from 'products.product' to 'vendors.vendorproduct'
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wishlists', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-added_at'],
                'unique_together': {('user', 'product')},
            },
        ),
    ]
