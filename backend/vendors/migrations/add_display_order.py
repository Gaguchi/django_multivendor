from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0001_initial'),  # Replace with your actual last migration
    ]

    operations = [
        migrations.AddField(
            model_name='vendorproduct',
            name='display_order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='productimage',
            name='alt_text',
            field=models.CharField(blank=True, help_text='Alternative text for accessibility', max_length=255),
        ),
        migrations.AlterModelOptions(
            name='vendorproduct',
            options={'ordering': ['display_order', 'name']},
        ),
    ]
