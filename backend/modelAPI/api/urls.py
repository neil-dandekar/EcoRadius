from django.urls import path
from .views import classify_input

urlpatterns = [
    path("classify/", classify_input, name="classify-input"),
]
