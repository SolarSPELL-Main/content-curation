from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

@api_view(('GET',))
@renderer_classes((JSONRenderer,))
def mock_data(request):
    def build_metadata(name: str, id: int):
        return {
            "name": name,
            "id": id,
        }

    return JsonResponse({
        "Subject": [build_metadata(name, i) for i, name in enumerate(["Math", "Language Arts", "Computer Science"])],
        "Language": [build_metadata(name, i) for i, name in enumerate(["Arabic", "English", "Spanish", "Chinese", "Hindi"])],
    })
# Create your views here.
