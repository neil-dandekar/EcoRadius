import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, KmlLayer } from "@react-google-maps/api";

const Map = () => {
  const [cds, setCoords] = useState({ lat: 0, lng: 0 });

  const geoLocate = (position) => {
      console.log(position.coords.latitude, position.coords.longitude)
      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
  };

    const geoLocateErr = (err) => {
        console.log("Error occurred with geolocation measurement!!!: ", err.message);
    }
    
    // get position
    useEffect(() => {
        const interval = setInterval(() => {
            if("geolocation" in navigator){
                navigator.geolocation.watchPosition(geoLocate, geoLocateErr, 
                    {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
                 );
            }
            console.log(cds.lat, cds.lng)
        }, 10000);
        return () => clearInterval(interval)
    }, []);

  return (
    <LoadScript googleMapsApiKey={"AIzaSyBIXoPr9hxhk7hs5PRlP9imymTuPC0TPzI"}>
      <GoogleMap
        mapContainerStyle={{ width: "400px", height: "400px" }}
        center={cds}
        zoom={10}
      >
        <KmlLayer
          url={'https://ecoradius.vercel.app/trashcan.kml'}
          options={{ preserveViewport: true }}
          onLoad={() => console.log('KML Layer loaded!')}
          onError={(error) => console.error('Error loading KML Layer:', error)}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
