import React, {useState, useEffect} from 'react'
import { LoadScript, GoogleMap, KmlLayer } from '@react-google-maps/api';

const Map = () => {

    const [cds, setCoords] = useState({lat: 0, lng: 0});

    const geoLocate = () => {
        navigator.geolocation.getCurrentPosition((position) =>
            {setCoords({lat: position.coords.latitude, lng: position.coords.longitude})
        });
    }

    const geoLocateErr = () => {
        console.log("Error occurred with geolocation measurement!!!");
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
        }, 1000);
        return () => clearInterval(interval)
    }, []);

    /* const startTrackingLocation = () => {
        if("geolocation" in navigator){
            navigator.geolocation.watchPosition(geoLocate, geoLocateErr, 
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
             );
        } else {
            console.log("ERROR! Start tracking location failed!!!!")
        }

    }

    startTrackingLocation();
 */

    // <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIXoPr9hxhk7hs5PRlP9imymTuPC0TPzI&callback=initMap" async defer></script>
    // <div id="map"></div>
    return(
        <LoadScript googleMapsApiKey={'AIzaSyBIXoPr9hxhk7hs5PRlP9imymTuPC0TPzI'}>
            <GoogleMap 
                mapContainerStyle = {{width: '400px', height: '400px'}}
                center = {cds}
                zoom = {8}
            >
                <KmlLayer 
                    url = {'../assets/trashcan.kml'}
                    options={{ preserveViewport: true }}
                />
            </GoogleMap>
        </LoadScript>
    );
}

export default Map