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
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
              // Ensure the video element is still available when metadata is loaded
              if (videoRef.current && canvasRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            };
          }
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    startCamera();
    return () => {
      if (videoRef.current) {
        const tracks =
          videoRef.current.srcObject instanceof MediaStream
            ? videoRef.current.srcObject.getTracks()
            : [];
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        const base64image = canvasRef.current.toDataURL("image/jpeg");
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
