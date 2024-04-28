from rest_framework.response import Response
from rest_framework.decorators import api_view
from model.classifier import Classifier


@api_view(["POST"])
def classify_input(request):
    if "image" not in request.data:
        return Response({"error": "No file uploaded"}, status=400)
    image_data = request.data["image"]

    classifier = Classifier()
    prediction = classifier.predict(image_data)

    # Send back the prediction
    return Response({"prediction": prediction})
