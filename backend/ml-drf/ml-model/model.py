import torch
from torchvision import models, transforms
from PIL import Image

# Instantiate the model with the default initial weights (not pretrained)
model = models.mobilenet_v2(weights=None)

# Adjust the classifier to match your number of classes
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 6)

# Load custom weights
weights_path = "weights/trained_model_weights.pth"

# Load the model weights into CPU
model.load_state_dict(torch.load(weights_path, map_location=torch.device("cpu")))
model.eval()  # Set the model to evaluation mode

# Define the transformation
transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),  # Resize the image to fit the model input
        transforms.ToTensor(),  # Convert the image to a PyTorch tensor
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
        ),  # Normalize the image
    ]
)


# Function to load and transform an image
def load_and_transform_image(image_path):
    image = Image.open(image_path)
    return transform(image).unsqueeze(0)  # Add batch dimension


def predict_image(model, image_tensor):
    model.eval()  # Set the model to evaluation mode
    with torch.no_grad():  # Disable gradient calculation
        outputs = model(image_tensor)
        _, predicted = torch.max(outputs, 1)  # Get the index of the max log-probability
    return predicted.item()


# Example usage
image_path = "inputs/test3.jpg"
image_tensor = load_and_transform_image(image_path)
predicted_class_index = predict_image(model, image_tensor)
print(f"Predicted class index: {predicted_class_index}")

# Assuming you have a list of class names
# {'cardboard': 0, 'glass': 1, 'metal': 2, 'paper': 3, 'plastic': 4, 'trash': 5}
class_names = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

# Get the class name from the predicted index
predicted_class_name = class_names[predicted_class_index]
print(f"Predicted class name: {predicted_class_name}")
