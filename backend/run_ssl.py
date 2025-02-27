import os
import ssl
import sys
from django.core.management import execute_from_command_line
from django.conf import settings

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
    try:
        if not os.path.exists('certificates'):
            print("SSL certificate files not found. Generating self-signed certificates...")
            os.system('mkdir certificates')
            os.system('openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certificates/localhost.key -out certificates/localhost.crt -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"')
        
        # Run Django development server with SSL
        sys.argv = [
            'manage.py',
            'runserver_plus',  # We'll use django-extensions' runserver_plus
            '--cert-file=certificates/localhost.crt',
            '--key-file=certificates/localhost.key',
            '127.0.0.1:8000'
        ]
        execute_from_command_line(sys.argv)
    except Exception as e:
        print(f"Error: {e}")
        print("\nPlease install django-extensions:")
        print("pip install django-extensions Werkzeug pyOpenSSL")
