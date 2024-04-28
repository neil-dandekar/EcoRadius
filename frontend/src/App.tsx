import { useState } from "react";
import Scan from "./Scan";
import Map from "./Map";
import "./App.css";

export const App = () => {
  const [showMap, setShowMap] = useState(false); // State to toggle between Scan and Map

  const handleShowMap = () => {
    setShowMap(true); // This will be called to show the Map after capture
  };

  return (
    <>
      <h1>EcoRadius</h1>
      <div className="appBackground">
        {!showMap ? <Scan onCaptureDone={handleShowMap} /> : <Map />}
      </div>
    </>
  );
};

export default App;
