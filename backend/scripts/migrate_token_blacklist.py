import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_multivendor.settings")
django.setup()

def run_migrations():
    """Run migrations for token_blacklist app"""
    from django.core.management import call_command
    
    try:
        print("Making migrations for token_blacklist...")
        call_command('makemigrations', 'token_blacklist')
        
        print("Applying migrations for token_blacklist...")
        call_command('migrate', 'token_blacklist')
        
        print("Applying all other migrations...")
        call_command('migrate')
        
        print("Successfully migrated the database.")
        return True
    except Exception as e:
        print(f"Error running migrations: {e}")
        return False

if __name__ == "__main__":
    success = run_migrations()
    sys.exit(0 if success else 1)
