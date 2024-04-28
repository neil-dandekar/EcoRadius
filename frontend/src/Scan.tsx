import "./Scan.css";
import React, { useState } from "react";

const Scan = () => {
  const [image, setImage] = useState("");
  // const [prediction, setPrediction] = useState("");

  const capture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt: ProgressEvent<FileReader>) {
        const base64image = evt.target!.result as string;
        setImage(base64image);
        sendToBackend(base64image);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToBackend = (base64image: string) => {
    fetch("http://127.0.0.1:8000/api/classify/", {
      // Ensure this URL is correct and points to your Django server
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64image }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="scanctr">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={capture}
          className="feed"
        />
        {image && (
          <img
            src={image}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </div>
    </>
  );
};

export default Scan;
