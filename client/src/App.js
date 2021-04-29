import React, { Component } from 'react';
import Map from './components/Map.js'
import SpotifyWebApi from 'spotify-web-api-js';
import cities from './places.json';
import latLng from './lat-lng.json'

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
      topGenre: [],
      algoGeneration: "nothing yet",
      topCity: 'No top matches generated yet',
      genresGenerated: false,
      allCities: cities,
      allLocations: latLng["items"],
      points: [[50,1],[50,1.25], [50,1.5],[50,1.75], [50,2]]

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
              // profilePic: data.images[0].url
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
        topGenre: this.state.algoGeneration[2],
        genresGenerated: true,
        points: this.getCitiesLatLng()
      }); 
    });
  };

  getCitiesLatLng(){
    var i = 0;
    var k = 0;
    var cities = this.state.algoGeneration[0];
    var countries = this.state.algoGeneration[1];
    var locations = []; 
    for(i = 0; i < cities.length; i++){
     // console.log(cities[i]);
      for(k = 0; k < this.state.allLocations.length; k++){
        if(cities[i] ===  this.state.allLocations[k].city && countries[i] === this.state.allLocations[k].country){
          console.log(cities[i]);
          locations.push([this.state.allLocations[k].lat, this.state.allLocations[k].lng]);
        }
      }
    };
   //locations.push([0,0]);
   //locations.push([0,0]);
   return locations;
  };

  render() {    
    return (
      <div className="App">
        {this.state.loggedIn ? <a className="spotify-style" href = {LOGOUT_URI}>Logout</a> : <a className="spotify-style" href={LOGIN_URI}> Login to Spotify </a>}
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
        
        { this.state.loggedIn && !this.state.genresGenerated &&
        <button className="spotify-style" onClick={() => this.getGenreInfo()}>
         Get your genres
        </button>
      }

     { this.state.loggedIn && this.state.genresGenerated &&
      <div>
        <UserCityList citiesObject = {this.state.algoGeneration} callback = {(topCity) => this.setState({topCity})}/>
      </div>}
        <div>
        <Map cityLocations = {this.state.points} cityInfo={this.state.algoGeneration}/>
        </div>
 
      </div>
    );
  }
}
export default App;