// import "./Scan.css";
// import React, { useState } from "react";

// const Scan = () => {
//   const [image, setImage] = useState("");
//   const [prediction, setPrediction] = useState("None");

//   const capture = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (evt: ProgressEvent<FileReader>) {
//         const base64image = evt.target!.result as string;
//         setImage(base64image);
//         sendToBackend(base64image);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const sendToBackend = (base64image: string) => {
//     fetch("http://127.0.0.1:8000/api/classify/", {
//       // Ensure this URL is correct and points to your Django server
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ image: base64image }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         setPrediction(data.prediction); // Update the prediction state with the class received from the backend
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setPrediction("Error in prediction"); // Handle any errors
//       });
//   };

//   return (
//     <>
//       <div className="scanctr">
//         <input
//           type="file"
//           accept="image/*"
//           capture="environment"
//           onChange={capture}
//           className="feed"
//         />
//         {image && (
//           <img
//             src={image}
//             alt="Captured"
//             style={{ width: "100%", height: "auto" }}
//           />
//         )}
//         Prediction: {prediction}
//       </div>
//     </>
//   );
// };

// export default Scan;

import "./Scan.css";
import React, { useState, useRef, useEffect } from "react";

const Scan = () => {
  const [image, setImage] = useState<string>("");
  const [prediction, setPrediction] = useState<string>("None");
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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "auto" }}
        ></video>
        <button onClick={capture}>Capture</button>
        {image && (
          <img
            src={image}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width="640"
          height="480"
        ></canvas>
        <div>Prediction: {prediction}</div>
      </div>
    </>
  );
};

export default Scan;
