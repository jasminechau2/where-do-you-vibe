import { MapContainer, TileLayer, Marker, Popup, useMap, setView, whenCreated} from 'react-leaflet'
import React, {useState, useCallback} from "react"
import { map } from 'leaflet';

function MakeMarkers({cityInfo, cityDetails, cityLocations}){
  const map = useMap();

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
             Genres: {cityDetails[k].genres.length >= 10 ? cityDetails[k].genres.slice(0,9).toString() : cityDetails[k].genres.toString()}
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
      <div key = {location} >
        <Marker position={location} 
         eventHandlers={{
          click: () => {
            map.setView(
              location,
              14
            );
          }
        }}
        >
          <Popup>
            {popupContent[i]}
          </Popup>
        </Marker> 
    </div>
    )
  })

  return (latLan)
}

function ResetButton({center, zoom, map}){
  const onClick = useCallback(()=>{
    map.setView(center, zoom)
  },[map])
  return ( 
    <button onClick={onClick}>reset</button>)
}

function Map({cityLocations, cityInfo, cityDetails}) {
  const [map, setMap] = useState(null);
  const[center] = useState([0,0]);
  const zoom = 2
  return (
    <div id="mapid">
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
       integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
       crossorigin=""/>  
       {map ? <ResetButton center={center} zoom={zoom} map={map} /> : null}
        <MapContainer 
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{
              height: '400px',
              padding: "100px",
              marginTop: '50px',
              }}
              whenCreated={setMap}
              > 
               <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {cityLocations.length !== 0 ? <MakeMarkers cityInfo = {cityInfo} cityDetails = {cityDetails} cityLocations={cityLocations}/> : []}
          </MapContainer>
    </div>
    
  );
}

export default Map;
