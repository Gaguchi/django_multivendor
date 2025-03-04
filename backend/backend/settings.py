# Find the INSTALLED_APPS list and add 'reviews' to it

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party apps
    'rest_framework',
    'corsheaders',
    'django_extensions',  # Add this if not already present
    # Local apps
    'users',
    'vendors',
    'cart',
    'orders',
    'categories',
    'reviews',  # Add this line
    # Other apps...
]
