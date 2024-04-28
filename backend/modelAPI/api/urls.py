from django.urls import path
from .views import image_classifier

urlpatterns = [
    path("predict/", image_classifier, name="predict-image"),
]
