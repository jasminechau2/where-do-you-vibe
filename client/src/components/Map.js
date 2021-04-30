import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, {useState} from "react"


function Map({cityLocations, cityInfo, cityDetails}) {
  const[center, setCenter] = useState([0,0]);

   // const cities = cityInfo[0];
   // const countries = cityInfo[1]; 
   console.log(cityInfo);
    const latLan = cityLocations.map(location =>  
      <li key = {location}>
        <Marker position={location}>
          <Popup>
            {location}
          </Popup>
        </Marker> 
        </li>
        );
  


  
  return (
    <div >
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
       integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
       crossorigin=""/>
        <MapContainer 
            center={center}
            zoom={3}
            scrollWheelZoom={false}
            style={{
              height: '500px',
              padding: "100px",
              marginTop: '50px',
              }}> 
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {cityLocations !== 0 ? latLan : []}
          </MapContainer>
    </div>
    
  );
}

export default Map;
