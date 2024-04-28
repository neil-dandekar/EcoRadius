import "./Scan.css";
import { useState, useRef, useEffect } from "react";

const Scan = () => {
  const [image, setImage] = useState<string>("");
  const [prediction, setPrediction] = useState<string>("None");
  const [bintype, setBintype] = useState<string>("None");
  const [captured, setCaptured] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
              // Set the canvas size to the video size once it's loaded
              if (canvasRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            };
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
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const base64image = canvas.toDataURL("image/jpeg");
        setImage(base64image);
        setCaptured(true);
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
        setPrediction(data.prediction);
        const bin = determineBin(data.prediction);
        setBintype(bin);
      })
      .catch((error) => {
        console.error("Error:", error);
        setPrediction("Error in prediction");
        setBintype("Error determining bin type");
      });
  };

  const determineBin = (prediction: string) => {
    switch (prediction) {
      case "glass":
      case "cardboard":
      case "plastic":
      case "metal":
        return "recyclable";
      case "trash":
        return "landfill";
      case "paper":
        return "compostable";
      default:
        return "unknown";
    }
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
        {!captured && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "auto" }}
            ></video>
            <button onClick={capture}>Capture</button>
          </>
        )}
        {captured && (
          <>
            <img
              src={image}
              alt="Captured"
              style={{ width: "100%", height: "auto" }}
            />
            <div>
              Prediction: {prediction}
              Bin Type: {bintype}
            </div>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </>
  );
};

export default Scan;
