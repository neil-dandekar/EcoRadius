import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, KmlLayer } from "@react-google-maps/api";
import {getDistance, findNearest} from 'geolib';



const google = window.google;

const Map = () => {
  const [cds, setCoords] = useState({ lat: 0, lng: 0 });
  const minDist = async () => {

  };
  const minDist = async () => {
    try{
        const res = await fetch('https://ecoradius.vercel.app/trashcan.kml')
        const kml = await res.text()
        const parser = new DOMParser()
        const xml = parser.parseFromString(kml, "application/xml")
        const placemarks = xml.getElementsByTagName("Placemark")
        
        var coordsText, coords, dist, singCoord
        let minMarkerDist = Infinity
        let minMarker = null
        for(let i = 0; i < placemarks.length; i++){
            coordsText = placemarks[i].getElementsByTagName("coordinates");
            console.log(coordsText)
            coords = coordsText.trim().split(',').map(Number)
            singCoord = new google.maps.LatLng(coords[1],coords[0])
            dist = google.maps.geometry.spherical.computeDistanceBetween(cds, singCoord)
            if(minMarkerDist > dist){
                minMarkerDist = dist
                minMarker = placemarks[i]
            }
        }
        //minMarker.getElementsByTagName("styleUrl")[0].childNodes[0].nodeValue = "";
        return [minMarkerDist, minMarker]
    } catch (err) {
        console.error("Failed parse! With error ", err)
        return []
    }
  }; 

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
            console.log(minDist('https://ecoradius.vercel.app/trashcan.kml')[0])
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
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
