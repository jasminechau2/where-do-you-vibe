import React, { Component} from 'react';
import Map from './components/Map.js'
import SpotifyWebApi from 'spotify-web-api-js';
import cities from './places.json';

//import './components/UserGenresTemplate.js';


const spotifyApi = new SpotifyWebApi();
var findCities = require('../src/compare-artists');

class App extends Component {
  constructor(){ //This reads the token from the url, token allows us access to user info
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = { //sets state, allows us to know if someone is logged in and their name
      loggedIn: token ? true : false,
      displayTitle:"Where's your vibe?",
      topGenre: {},
      topCity: '',
      allCities: cities,
    }
    var c = this.state.loggedIn ? this.getUserInfo() : "";
  console.log(this.state.topCity)
  };

 
  getHashParams(){
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  };

  getUserInfo(){ //call to get user infomation from spotify api
      spotifyApi.getMe()
      .then((data) => {
        this.setState({
          user: { 
              displayName: data.display_name, 
            }
        });
      });  
  };

  
getGenreInfo(){
  spotifyApi.getMyTopArtists({time_range: 'medium_term', limit: 20})
  .then((data)=>{
    console.log(findCities.findCities(data, this.state.allCities));
     this.setState({
       topGenre: data,
       topCity: findCities.findCities(data, this.state.allCities),
    });     
   });

}
  
  render() {
    return (
      <div className="App">
        <div style = {{
          fontSize: "87px",
          color: "#1250B5"
        }}>
          { this.state.displayTitle }
        </div>

        <a href="https://everynoise.com/everyplace.cgi" style = {{
          fontSize: "36px",
          color: "#923307",
          textDecoration: "none",
        }}>Based on data from "Every Place at Once"</a>

        <a href='http://localhost:8888/login' style ={{
          marginTop: "10px",
          color: "white",
          backgroundColor: "#1db954",
          borderRadius: "46px",
          textDecoration: "none",
          height: "32px",
          width: "200px",
          fontSize: "24px",
          textAlign: "center",
          verticalAlign: "middle",
          padding: "5px"
        }}> Login to Spotify </a>
        
      { this.state.loggedIn &&
        <button onClick={() => this.getGenreInfo()} style={{
          marginTop: "10px",
          color: "white",
          backgroundColor: "#1db954",
          borderRadius: "46px",
          textDecoration: "none",
          height: "32px",
          width: "200px",
          fontSize: "24px",
          textAlign: "center",
          verticalAlign: "middle",
          padding: "5px"
        }}>
         Get your genres
        </button>
      }
      <div>
        {this.state.topCity}
      </div>
 
      <div>
      <Map cityLocations = {""} lat_lan={""}/>
      </div>
       
      </div>
    );
  }
}
export default App;