from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),  # Replace with your actual last migration
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='display_order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterModelOptions(
            name='category',
            options={'ordering': ['display_order', 'name'], 'verbose_name_plural': 'Categories'},
        ),
    ]
