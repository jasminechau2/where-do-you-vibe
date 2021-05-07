import React, { Component } from 'react';
import Map from './components/Map.js'
import SpotifyWebApi from 'spotify-web-api-js'; //https://github.com/thelinmichael/spotify-web-api-node
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
    const tokens = document.cookie.split(';')
    const access_tok = tokens[0].split('=');
    //const params = this.getHashParams();
    //const token = params.access_token; //This reads the token from the url, token allows us access to user info

    if (access_tok[0] !== "") {
      spotifyApi.setAccessToken(access_tok[1]);
    }
    this.state = { //sets state, allows us to know if someone is logged in and their name
      loggedIn: access_tok[0] ? true : false,
      user: {displayName:'your'},
      topGenre: [],
      algoGeneration: "nothing yet",
      selectedCity: '',
      genresGenerated: false,
      allCities: cities,
      allLocations: latLng["items"],
      points: [],
      topCity:''
    }

  };

  componentDidMount(){
    if(this.state.loggedIn){
      this.getUserInfo();
    };
  };

  getUserInfo(){ //call to get user infomation from spotify api
      spotifyApi.getMe()
      .then((data) => {
        this.setState({
          user: { 
              displayName: data.display_name.concat("","'s"), 
            }
        });
      });  
  };

  getGenreInfo(time){
    spotifyApi.getMyTopArtists({time_range: time, limit: 20})
    .then((data)=>{
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
      for(k = 0; k < this.state.allLocations.length; k++){
        if(cities[i] ===  this.state.allLocations[k].city && countries[i] === this.state.allLocations[k].country){
          locations.push([this.state.allLocations[k].lat, this.state.allLocations[k].lng]);
        };
      };
    };
   return locations
  };

  render() {    
    return (
      <div className="App">
        <ul className = "navigation">
          <li>Where's { this.state.user.displayName } vibe? </li>
          <li>
            {this.state.loggedIn ? <a className="spotify-style" href = {LOGOUT_URI}>Logout</a> : <a className="spotify-style" href={LOGIN_URI}> Login to Spotify </a>}
          </li>
        </ul>

        { this.state.loggedIn && !this.state.genresGenerated &&
           <div className="main-display-wrapper">
            <button className="spotify-style" onClick={() => this.getGenreInfo('short_term')}>
            Short term match
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('medium_term')}>
            Medium term match
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('long_term')}>
            Long term match
            </button>
          </div>
        }

      { this.state.loggedIn && this.state.genresGenerated &&
        <div>
          <UserCityList citiesObject = {this.state.algoGeneration} callback = {(selectedCity) => this.setState({topCity: selectedCity})}/>
          <div className="main-display-wrapper">
            <button className="spotify-style" onClick={() => this.getGenreInfo('short_term')}>
            Short term match
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('medium_term')}>
            Medium term match
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('long_term')}>
            Long term match
            </button>
          </div>
          <Map cityLocations = {this.state.points} cityInfo={this.state.algoGeneration} cityDetails = {this.state.allCities["items"]} selectedCity={this.state.topCity}/>
        </div>}
        </div>
      );
  }
}
export default App;
