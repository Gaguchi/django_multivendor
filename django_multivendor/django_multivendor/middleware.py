import logging
import json
from typing import Any
import copy
from django.http import HttpRequest, HttpResponse

# Configure logging
logging.basicConfig(
    filename='debug.log',
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

class RequestResponseLoggingMiddleware:
    def __init__(self, get_response):
        logger.debug("RequestResponseLoggingMiddleware initiated")
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Log request
        self.log_request(request)
        
        # Get response
        response = self.get_response(request)
        
        # Log response
        self.log_response(request, response)
        
        return response

    def mask_sensitive_data(self, data: dict) -> dict:
        """Mask sensitive information in the data dictionary."""
        sensitive_fields = [
            'password', 'token', 'access_token', 'authorization',
            'csrf', 'session', 'secret', 'cookie'
        ]
        masked_data = copy.deepcopy(data)
        
        for key, value in masked_data.items():
            if any(sensitive in key.lower() for sensitive in sensitive_fields):
                masked_data[key] = '[REDACTED]'
        
        return masked_data

    def log_request(self, request: HttpRequest) -> None:
        """Log detailed request information."""
        try:
            # Get request body
            body = None
            if request.body:
                try:
                    body = json.loads(request.body)
                except json.JSONDecodeError:
                    body = request.body.decode('utf-8')

            # Prepare request data
            request_data = {
                'path': request.path,
                'method': request.method,
                'query_params': dict(request.GET.items()),
                'post_data': dict(request.POST.items()),
                'body': body,
                'headers': dict(request.headers.items()),
            }

            # Mask sensitive data
            masked_data = self.mask_sensitive_data(request_data)

            # Log the request
            logger.debug(
                f"\n{'='*50} REQUEST {'='*50}\n"
                f"Path: {masked_data['path']}\n"
                f"Method: {masked_data['method']}\n"
                f"Query Parameters: {json.dumps(masked_data['query_params'], indent=2)}\n"
                f"POST Data: {json.dumps(masked_data['post_data'], indent=2)}\n"
                f"Body: {json.dumps(masked_data['body'], indent=2) if masked_data['body'] else 'None'}\n"
                f"Headers: {json.dumps(masked_data['headers'], indent=2)}\n"
            )
        except Exception as e:
            logger.error(f"Error logging request: {str(e)}")

    def log_response(self, request: HttpRequest, response: HttpResponse) -> None:
        """Log detailed response information."""
        try:
            # Get response content
            content = None
            if hasattr(response, 'content'):
                try:
                    content = response.content.decode('utf-8')
                    if len(content) > 1000:  # Truncate if too long
                        content = content[:1000] + "... [truncated]"
                except Exception:
                    content = "[Unable to decode response content]"

            # Prepare response data
            response_data = {
                'path': request.path,
                'status_code': response.status_code,
                'headers': dict(response.items()),
                'content': content
            }

            # Mask sensitive data
            masked_data = self.mask_sensitive_data(response_data)

            # Log the response
            logger.debug(
                f"\n{'='*50} RESPONSE {'='*50}\n"
                f"Path: {masked_data['path']}\n"
                f"Status Code: {masked_data['status_code']}\n"
                f"Headers: {json.dumps(masked_data['headers'], indent=2)}\n"
                f"Content: {masked_data['content']}\n"
            )
        except Exception as e:
            logger.error(f"Error logging response: {str(e)}")

class ResponseSizeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        size = len(response.content)
        kb_size = size / 1024
        
        if kb_size > 100:
            logger.warning(f"Large response detected: {kb_size:.2f}KB for {request.path}")
        
        return response