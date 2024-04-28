import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, KmlLayer, Marker } from "@react-google-maps/api";
import {findNearest} from 'geolib';

const locArr = [
    { latitude: 38.5454983, longitude: -121.754064 },
    { latitude: 38.5451431, longitude: -121.7548268 },
    { latitude: 38.54469, longitude: -121.7566535 },
    { latitude: 38.5446842, longitude: -121.7556015 },
    { latitude: 38.5434808, longitude: -121.7512634 },
    { latitude: 38.5433662, longitude: -121.7510025 },
    { latitude: 38.5430493, longitude: -121.7527257 },
    { latitude: 38.5428717, longitude: -121.7527173 },
    { latitude: 38.5428942, longitude: -121.7546399 },
    { latitude: 38.5433963, longitude: -121.7549456 },
    { latitude: 38.5443974, longitude: -121.7539907 },
    { latitude: 38.5448665, longitude: -121.7590169 },
    { latitude: 38.5427932, longitude: -121.7589547 },
    { latitude: 38.5438315, longitude: -121.7501785 },
    { latitude: 38.544146, longitude: -121.7497252 },
    { latitude: 38.5436495, longitude: -121.7497947 },
    { latitude: 38.5434816, longitude: -121.74954 },
    { latitude: 38.5422342, longitude: -121.7590788 },
    { latitude: 38.5424329, longitude: -121.7591844 },
    { latitude: 38.5405771, longitude: -121.7587609 },
    { latitude: 38.5391118, longitude: -121.7586834 },
    { latitude: 38.5392495, longitude: -121.7560312 },
    { latitude: 38.5392727, longitude: -121.7548487 },
    { latitude: 38.539287, longitude: -121.755023 },
    { latitude: 38.5394532, longitude: -121.755579 },
    { latitude: 38.5398403, longitude: -121.7551074 },
    { latitude: 38.5401016, longitude: -121.7557869 },
    { latitude: 38.5406759, longitude: -121.7551968 },
    { latitude: 38.5403963, longitude: -121.7546617 },
    { latitude: 38.540715, longitude: -121.7541262 },
    { latitude: 38.5410283, longitude: -121.7530217 },
    { latitude: 38.5412581, longitude: -121.752866 },
    { latitude: 38.5419407, longitude: -121.7530108 },
    { latitude: 38.5424231, longitude: -121.7530884 },
    { latitude: 38.5408979, longitude: -121.7522961 },
    { latitude: 38.5412231, longitude: -121.7517141 },
    { latitude: 38.541783, longitude: -121.7517497 }
];

const Map = () => {
    const [cds, setCoords] = useState({ lat: 0, lng: 0 });
    const [nearestCoord, setNearestCoord] = useState(null);

    const geoLocate = (position) => {
       // console.log(position.coords.latitude, position.coords.longitude)
        setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
        updateNearest({lat: findNearest(cds, locArr).latitude, lng: findNearest(cds, locArr).longitude })
    };

    const updateNearest = (currentCoords) => {
      setNearestCoord({lat: currentCoords.lat + 0.01, lng: currentCoords.lng + 0.01});
    }

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
            console.log("your coords: ", cds.lat, cds.lng)
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
          url='https://ecoradius.vercel.app/trashcan.kml'
          options={{ preserveViewport: true }}
          onLoad={() => console.log('KML Layer loaded!')}
          onError={(error) => console.error('Error loading KML Layer:', error)}
        />
        {nearestCoord && (
            <Marker
                position = {nearestCoord}
                icon = {"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
            />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
