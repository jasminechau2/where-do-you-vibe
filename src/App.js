import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [setCity1, getCity1] = useState();
  const [setCity2, getCity2] = useState();
  const [setCity3, getCity3] = useState();
  const [setCity4, getCity4] = useState();
  const [setCity5, getCity5] = useState();
  return (
    <div >
      <header >
      <p>
          Hello World
        </p>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
       integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
       crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
         integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
         crossorigin=""></script>
      </header>
      <body>
      <div id="mapid" >
      <MapContainer
       center={[51.505, -0.09]}
       zoom={13}
       scrollWheelZoom={false}
       style={{height: '100vh'}}> 
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                 <Marker position={[51.505, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={[51.502, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={[51.50, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={[51.508, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>

                <Marker position={[51.510, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
            </MapContainer>
            </div>
      </body>
    </div>
  );
}

export default App;
