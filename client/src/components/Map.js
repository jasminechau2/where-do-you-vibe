import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, {useState} from "react"


function Map({cityLocations, cityInfo, cityDetails}) {
  const[center, setCenter] = useState([0,0]);
   var popupContent = [];
   const cities = cityInfo[0];
   const countries = cityInfo[1]; 
   if(cities.length !== 0){
    for(let i = 0; i < cities.length; i++){
      for(let k = 0; k < cityDetails.length; k++){
        if(cities[i] === cityDetails[k].city && countries[i] === cityDetails[k].country){
          
          popupContent.push(
            <div>
              City: {cityDetails[k].city}  <br />
              Country: {cityDetails[k].country}  <br />
              Genres: {cityDetails[k].genres.toString()}
              </div>
          );
        };
      };
    };
   }
   var i = -1;
   
    const latLan = cityLocations.map(location => {
          i = i + 1;
          return (
            <div key = {location}>
              <Marker position={location}>
                <Popup>
                  {popupContent[i]}
                </Popup>
              </Marker> 
          </div>
          )
      });

  return (
    <div id="mapid">
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
       integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
       crossorigin=""/>
        <MapContainer 
            center={center}
            zoom={3}
            scrollWheelZoom={true}
            style={{
              height: '200px',
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
