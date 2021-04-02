import React, { Component } from 'react';
import './App.css';
import Map from './components/Map.js'
import SpotifyWebApi from 'spotify-web-api-js';
import cities from './places.json';

//import './components/UserGenresTemplate.js';
import UserGenreList from './components/UserGenresTemplate';


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
      user: {displayName:'not logged in', profilePic:''},
      topGenre: {},
      topCity: 'not logged in',
      allCities: cities,
    }
    var c = this.state.loggedIn ? this.getUserInfo() : "";
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
              profilePic: data.images[0].url
            }
        });
      });

      spotifyApi.getMyTopArtists({time_range: 'medium_term', limit: 20})
      .then((data)=>{
        console.log(data);
        this.setState({
          topGenre: data
        });
        this.state.topCity = findCities.findCities(data, this.state.allCities);     
       });
      console.log(this.state.topGenre[1]);
  };

  

  
  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888/login' > Login to Spotify </a>
        <div>
          Hello { this.state.user.displayName }
        </div>
        <div>
          <img src={this.state.user.profilePic} style={{ height: 150 }}/>
        </div>
        <div>
        <Map cityLocations = {""} lat_lan={""}/>
        </div>
       
      </div>
    );
  }
}
export default App;