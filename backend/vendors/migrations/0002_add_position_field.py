from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0001_initial'),  # Replace with your actual last migration
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productimage',
            options={'ordering': ['position']},
        ),
        # Only add this if position field doesn't exist yet
        migrations.AddField(
            model_name='productimage',
            name='position',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='productimage',
            name='alt_text',
            field=models.CharField(blank=True, help_text='Alternative text for accessibility', max_length=255),
        ),
    ]
