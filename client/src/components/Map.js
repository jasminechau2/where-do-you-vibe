import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, {useState} from "react"


function Map({cityLocations, lat_lan}) {
  // setup
  const[city1, setCity1] = useState([50,1]);
  const[city2, setCity2] = useState([50,1.25]);
  const[city3, setCity3] = useState([50,1.5]);
  const[city4, setCity4] = useState([50,1.75]);
  const[city5, setCity5] = useState([50,2]);
  const[center, setCenter] = useState([0,0]);

  return (
    <div >
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
       integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
       crossorigin=""/>
        <MapContainer 
            center={center}
            zoom={3}
            scrollWheelZoom={false}
            style={{height: '100vh'}}> 
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
                <Marker position={city1}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={city2}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={city3}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={city4}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={city5}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
          </MapContainer>
    </div>
    
  );
}

export default Map;