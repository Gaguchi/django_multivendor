# Generated by Django 4.2.5 on 2025-03-22 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0004_vendorproduct_category_vendorproduct_created_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='vendorproduct',
            name='frequently_bought_together',
            field=models.ManyToManyField(blank=True, help_text='Products that are frequently bought together with this product', related_name='bought_with_products', to='vendors.vendorproduct'),
        ),
    ]
