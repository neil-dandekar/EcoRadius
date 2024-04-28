import "./Scan.css";
import { useState, useRef, useEffect } from "react";

const Scan = () => {
  const [image, setImage] = useState<string>("");
  const [prediction, setPrediction] = useState<string>("None");
  const [bintype, setBintype] = useState<string>("None");
  const [capturing, setCapturing] = useState<boolean>(false); // New state to track if a capture has been taken
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera(); // Ensures the camera is stopped when the component unmounts
    };
  }, []);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
        });
    }
  };

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64image = canvas.toDataURL("image/jpeg");
        setImage(base64image);
        setCapturing(true); // Update capturing state to true to show the captured image
        sendToBackend(base64image);
      }
    }
  };

  const sendToBackend = (base64image: string) => {
    fetch("http://127.0.0.1:8000/api/classify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64image }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setPrediction(data.prediction);
        let bin: string = "bruh";
        console.log(data.prediction);
        switch (data.prediction) {
          case "glass":
          case "cardboard":
          case "plastic":
          case "metal":
            bin = "recyclable";
            break;
          case "trash":
            bin = "landfill";
            break;
          case "paper":
            bin = "compostable";
            break;
        }
        console.log(bin);
        setBintype(bin);
      })
      .catch((error) => {
        console.error("Error:", error);
        setPrediction("Error in prediction");
      });
  };

  const stopCamera = () => {
    const tracks =
      videoRef.current?.srcObject instanceof MediaStream
        ? videoRef.current.srcObject.getTracks()
        : [];
    tracks.forEach((track) => track.stop());
  };

  return (
    <>
      <div className="scanctr">
        {!capturing && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "50%", height: "50%" }}
          ></video>
        )}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width="640"
          height="480"
        ></canvas>
        {capturing && (
          <img
            src={image}
            alt="Captured"
            style={{ width: "50%", height: "50%" }}
          />
        )}
        <button onClick={capture}>Capture</button>
        <div>
          Prediction: {prediction}, Bin Type: {bintype}
        </div>
      </div>
    </>
  );
};

export default Scan;
