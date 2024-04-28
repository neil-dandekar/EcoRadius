from django.urls import path
from .views import image_classifier

urlpatterns = [
    path("classify/", image_classifier, name="classify-image"),
]
