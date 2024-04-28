from rest_framework.response import Response
from rest_framework.decorators import api_view
from model.classifier import Classifier


@api_view(["POST"])
def classify_input(request):
    print("helloooo")
    if "image" not in request.data:
        return Response({"error": "No file uploaded"}, status=400)
    image_data = request.data["image"]
    print(image_data)
    print("hello")
    classifier = Classifier()
    print("hello2")

    prediction = classifier.predict(image_data)

    print("PREDICTION:", prediction)

    # Send back the prediction
    return Response({"prediction": prediction})
