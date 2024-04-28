import React, { useState } from "react";
import Scan from "./Scan";
import Map from "./Map";

export const App = () => {
  const [showMap, setShowMap] = useState(false); // State to toggle between Scan and Map

  const handleShowMap = () => {
    setShowMap(true); // This will be called to show the Map after capture
  };

  //return <>{!showMap ? <Scan onCaptureDone={handleShowMap} /> : <Map />}</>;
  return(
    <>
      <Scan onCaptureDone={handleShowMap}/>
      <Map />
    </>
  );
};

export default App;
