from django.http import Response
from rest_framework.decorators import api_view
from ..model.classifier import Classifier


@api_view(["POST"])
def classify_input(request):
    if "file" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)

    classifier = Classifier()
    # image_path = "inputs/test3.jpg"
    prediction = classifier.predict(image_path)

    # Send back the prediction
    return Response({"prediction": prediction})
