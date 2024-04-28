import torch
from torchvision import models, transforms
from PIL import Image

# 3. Load the pretrained MobileNetV2 model
# Load the pretrained MobileNetV2 model from torchvision:
model = models.mobilenet_v2(pretrained=True)
model.eval()  # Set the model to evaluation mode

# 4. Define image transformations
# Define the transformations needed to preprocess the input image so it can be fed into the model. MobileNetV2 requires the input size to be 224x224 pixels, and the image should be normalized:
transform = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)


# 5. Load and preprocess the image
# Load the image using PIL and apply the transformations:
def load_image(image_path):
    image = Image.open(image_path)
    image = transform(image)
    image = image.unsqueeze(0)  # Add a batch dimension
    return image


# 6. Classify the image
# With the model and image ready, you can now classify the image:


def classify(image_path, model):
    image = load_image(image_path)
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
    return predicted


# 7. Customize for waste classification
# The model is pretrained on ImageNet, which means it is not directly trained to recognize types of waste. You'll need to retrain or fine-tune it on a dataset specific to waste materials. Here’s a basic way to adapt it:

# Collect a dataset: Gather images of different types of waste (plastics, paper, metals, etc.).
