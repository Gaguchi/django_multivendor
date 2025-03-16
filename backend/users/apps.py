from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        """Connect signal handlers when the app is ready"""
        import users.signals  # Import signals to ensure they're connected
