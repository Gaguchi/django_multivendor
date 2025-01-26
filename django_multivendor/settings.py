
# ...existing code...
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    # ...existing code...
}

SIMPLE_JWT = {
    'SIGNING_KEY': SECRET_KEY,  # or another secure key
    'ALGORITHM': 'HS256',
    # ...existing code...
}
# ...existing code...