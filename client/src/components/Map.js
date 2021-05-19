import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import React, {useState, useCallback} from "react"
//USER GENRE LIST LIMIT IS 15
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
        <Marker position={location}
         eventHandlers={{
          click: () => {
            map.setView(
              location,
              10
            );
          },
          mouseover: (open) => {
            open.target.openPopup();
          }
        }}
        key = {location}
        >
          <Popup
            autoPan = {false}
            onClose = {() =>{
              var pos = map.getCenter();
              if(pos.lat === location[0] && pos.lng === location[1]){
                map.setView([40,0], 2)
              }
            } 
            }
          >
            {popupContent[i]}
          </Popup>
        </Marker> 
    )
  })

  return (latLan)
}

function ResetButton({map}){
 
  const onClick = useCallback(() => {
    map.setView([40,0], 2)
  }, [map])

  return ( 
    <button className="spotify-style" onClick={onClick}>Reset zoom</button>)
}

function Map({cityLocations, cityInfo, cityDetails, selectedCity}) {
  const [map, setMap] = useState(null);
  const center = [40,0];
  const zoom = 2;
  console.log(selectedCity);
  return (
    <div id="mapid">
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
       integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
       crossorigin=""/>  
        <MapContainer 
            minZoom ={zoom}
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{
              height: '550px',
              width: '1000px'
              }}
              whenCreated={setMap}
              > 
               <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {cityLocations.length !== 0 ? <MakeMarkers cityInfo = {cityInfo} cityDetails = {cityDetails} cityLocations={cityLocations}/> : []}
          </MapContainer>
          {map ? <ResetButton center={center} zoom={zoom} map={map} /> : null}
    </div>
    
  );
}

export default Map;

//references
//https://stackoverflow.com/questions/65663372/how-to-change-map-zoom-dynamically-when-clicking-on-a-marker-in-react-leaflet-v
//https://react-leaflet.js.org/
//https://stackoverflow.com/questions/51662140/how-to-toggle-popup-in-react-leaflet-on-mouse-hover
//https://react-leaflet.js.org/docs/api-map