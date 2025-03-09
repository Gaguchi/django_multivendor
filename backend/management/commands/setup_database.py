from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
import logging

class Command(BaseCommand):
    help = 'Setup database schema and migrations for the application'

    def handle(self, *args, **options):
        self.setup_logging()
        self.stdout.write('Starting database setup...')
        
        # Check if token_blacklist tables exist
        self.stdout.write('Checking for token_blacklist tables...')
        if not self.table_exists('token_blacklist_outstandingtoken'):
            self.stdout.write('Token blacklist tables not found. Creating...')
            
            # Run makemigrations and migrate for token_blacklist
            self.stdout.write('Running makemigrations for token_blacklist...')
            call_command('makemigrations', 'token_blacklist')
            
            self.stdout.write('Running migrate for token_blacklist...')
            call_command('migrate', 'token_blacklist')
        else:
            self.stdout.write('Token blacklist tables already exist.')
        
        # Run migrations for all apps
        self.stdout.write('Running migrations for all apps...')
        call_command('migrate')
        
        self.stdout.write(self.style.SUCCESS('Database setup complete!'))

    def table_exists(self, table_name):
        """Check if a table exists in the database"""
        with connection.cursor() as cursor:
            tables = connection.introspection.table_names(cursor)
            return table_name in tables
    
    def setup_logging(self):
        """Setup logging for the command"""
        logger = logging.getLogger('django')
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
