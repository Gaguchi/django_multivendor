from rest_framework_simplejwt.tokens import RefreshToken

def create_jwt_token(backend, user, response, *args, **kwargs):
    refresh = RefreshToken.for_user(user)
    # Store tokens in session for frontend retrieval
    backend.strategy.session['jwt_tokens'] = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
