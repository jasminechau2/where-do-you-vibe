import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, {useState} from "react"


function Map({cityLocations, cityInfo}) {
  //console.log(cityLocations);
  // setup
 // const[city1] = useState(cityLocations[0]);
 // const[city2] = useState(cityLocations[1]);
 // const[city3] = useState(cityLocations[2]);
 // const[city4] = useState(cityLocations[3]);
 // const[city5] = useState(cityLocations[4]);
  const[center, setCenter] = useState([0,0]);
  
  
  console.log(cityLocations[0]);
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
                <Marker position={cityLocations[0]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={cityLocations[1]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={cityLocations[2]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={cityLocations[3]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={cityLocations[4]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
          </MapContainer>
    </div>
    
  );
}

export default Map;
