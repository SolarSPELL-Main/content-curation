from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

def standard_exception_handler(exc, context):
   
    response = exception_handler(exc, context)
    if response is not None:
        logger.error(getattr(response, "data", ""))
        response.data = {
            'data': None,
            'error': getattr(response, "data", ""),
            'success': False
        }
    return response

def build_response(data=None, status=status.HTTP_200_OK, success=True, 
                    error=None):
    logger.warning(data)
    return Response({
        "success": success,
        "data": data,
        "error": error
    }, status)
