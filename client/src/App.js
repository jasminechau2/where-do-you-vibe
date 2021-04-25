import React, { Component } from 'react';
import Map from './components/Map.js'
import SpotifyWebApi from 'spotify-web-api-js';
import cities from './places.json';
import latLng from './lat-lng1.json'

//import './components/UserGenresTemplate.js';
import UserCityList from './components/user-cities-display-template';


const spotifyApi = new SpotifyWebApi();
var findCities = require('./compare-artists.js');

const LOGIN_URI =
process.env.NODE_ENV !== 'production'
? 'http://localhost:8888/login'
: 'https://where-do-you-vibe.herokuapp.com/login';

const LOGOUT_URI =
process.env.NODE_ENV !== 'production'
? 'http://localhost:8888/logout'
: 'https://where-do-you-vibe.herokuapp.com/logout';

class App extends Component { 
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token; //This reads the token from the url, token allows us access to user info
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = { //sets state, allows us to know if someone is logged in and their name
      loggedIn: token ? true : false,
      user: {displayName:'your', profilePic:''},
      topGenre: {},
      algoGeneration: "nothing yet",
      topCity: 'No top matches generated yet',
      genresGenerated: false,
      allCities: cities,
      allLocations: latLng,
      topCities: 'No top matches generated yet',
    } 
  };

  componentDidMount(){
    if(this.state.loggedIn){
      this.getUserInfo()
    };
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
              displayName: data.display_name.concat("","'s"), 
              profilePic: data.images[0].url
            }
        });
      });  
  };

  
getGenreInfo(){
  spotifyApi.getMyTopArtists({time_range: 'medium_term', limit: 20})
  .then((data)=>{
     //this.setState({topGenre: data});
     this.setState({algoGeneration: findCities.findCities(data, this.state.allCities)});
     this.setState({
       topGenre: data,
       topCity: findCities.findCities(data, this.state.allCities),
       genresGenerated: true,
    });     
   });
};

setCities(cityData){
 // state.topCities = cityData;
};

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? <a href = {LOGOUT_URI}>Logout</a> : <a href={LOGIN_URI}> Login to Spotify </a>}
        <div style = {{
            fontSize: "56px",
            color: "#1250B5",
            textDecoration: "none",
          }}>
            Where's { this.state.user.displayName } vibe? 
        </div>

        <a href="https://everynoise.com/everyplace.cgi" style = {{
          fontSize: "36px",
          color: "#923307",
          textDecoration: "none",
        }}>Based on data from "Every Place at Once"</a>

        { !this.state.loggedIn &&
          <a href={LOGIN_URI} style ={{
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
            padding: "5px",
            cursor: "pointer"
          }}> Login to Spotify </a>
        }
        
        { this.state.loggedIn && !this.state.genresGenerated &&
        <button onClick={() => this.getGenreInfo()} style={{
          marginTop: "10px",
          color: "white",
          backgroundColor: "#1db954",
          borderRadius: "46px",
          textDecoration: "none",
          height: "38px",
          width: "200px",
          fontSize: "24px",
          textAlign: "center",
          verticalAlign: "middle",
          padding: "5px",
          border: "none",
          cursor: "pointer"
        }}>
         Get your genres
        </button>
      }

     { this.state.loggedIn && this.state.genresGenerated &&
      <div>
        <UserCityList citiesObject = {this.state.algoGeneration} callback = {this.setCities}/>
        
      </div>}

        <div>
        <Map cityLocations = {this.state.topCity} lat_lan={""}/>
        </div>
       
      </div>
    );
  }
}
export default App;