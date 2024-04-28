import React, {useState} from 'react'

export const Map = () => {

    var map
    const [cds, setCoords] = useState({lat: 0, lng: 0});

    const geoLocate = () => {
        navigator.geolocation.getCurrentPosition((position) =>
            {setCoords({lat: position.coords.latitude, lng: position.coords.longitude})
        });
    }

    const geoLocateErr = () => {
        console.log("Error occurred with geolocation measurement!!!");
    }

    const initMap = () => {
        map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
            center: cds,
            zoom: 8
        });
    }

    const startTrackingLocation = () => {
        if("geolocation" in navigator){
            navigator.geolocation.watchPosition(geoLocate, geoLocateErr, 
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
             );
        } else {
            console.log("ERROR! Start tracking location failed!!!!")
        }

    }

    startTrackingLocation();

    return(
        <>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIXoPr9hxhk7hs5PRlP9imymTuPC0TPzI&callback=initMap" async defer></script>
            <div id="map"></div>
        </>
    );
}