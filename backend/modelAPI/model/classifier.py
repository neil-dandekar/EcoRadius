import torch
from torchvision import models, transforms
from PIL import Image


class Classifier:
    weights_path = "weights/trained_model_weights.pth"

    def __init__(self, weights_path=weights_path):

        # Initialize the MobileNetV2 model
        self.model = models.mobilenet_v2(weights=None)
        self.model.classifier[1] = torch.nn.Linear(
            self.model.classifier[1].in_features, 6
        )

        # Load custom weights and set the model to evaluation mode
        self.model.load_state_dict(
            torch.load(weights_path, map_location=torch.device("cpu"))
        )
        self.model.eval()

        # Define image transformation
        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )

        # Class names mapping
        self.class_names = {
            0: "cardboard",
            1: "glass",
            2: "metal",
            3: "paper",
            4: "plastic",
            5: "trash",
        }

    def transform_input(self, image_path):
        """Transform an input image file path into a tensor suitable for model input."""
        image = Image.open(image_path)
        return self.transform(image).unsqueeze(0)  # Add batch dimension

    def classify_input(self, image_tensor):
        """Classify an input image tensor and return the class name."""
        with torch.no_grad():  # Disable gradient calculation for inference
            outputs = self.model(image_tensor)
            _, predicted = torch.max(
                outputs, 1
            )  # Get the index of the max log-probability
        return self.class_names[predicted.item()]

    def predict(self, image_path):
        """Perform the complete prediction process from the image file path."""
        image_tensor = self.transform_input(image_path)
        return self.classify_input(image_tensor)


# Example usage
# classifier = Classifier()
# image_path = "inputs/test3.jpg"
# predicted_class_name = classifier.predict(image_path)
# print(f"Predicted class name: {predicted_class_name}")
