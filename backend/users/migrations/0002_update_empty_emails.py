from django.db import migrations
from django.db.models import F

def update_empty_emails(apps, schema_editor):
    """
    For users that may have empty emails, 
    set their email to their username if it's a valid email
    """
    User = apps.get_model('auth', 'User')
    users_without_email = User.objects.filter(email='')
    
    # For users with empty emails, use username if it looks like an email
    for user in users_without_email:
        if '@' in user.username:
            user.email = user.username
            user.save()
    
    print(f"Updated {users_without_email.count()} users with empty emails.")

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),  # Adjust this to your latest migration
    ]

    operations = [
        migrations.RunPython(update_empty_emails),
    ]
