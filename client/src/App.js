import React, { Component} from 'react';
import Map from './components/Map.js'
import SpotifyWebApi from 'spotify-web-api-js';
import cities from './places.json';
import latLng from './lat-lng1.json'

//import './components/UserGenresTemplate.js';
import UserGenreList from './components/UserGenresTemplate';


const spotifyApi = new SpotifyWebApi();
var findCities = require('./compare-artists');

const LOGIN_URI =
process.env.NODE_ENV !== 'production'
? 'http://localhost:8888/login'
: 'https://where-do-you-vibe.herokuapp.com/login';

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
      topCity: 'No top matches generated yet',
      allCities: cities,
      allLocations: latLng,
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
              profilePic: data.images[0].url
            }
        });
      });  
  };

  
getGenreInfo(){
  spotifyApi.getMyTopArtists({time_range: 'medium_term', limit: 20})
  .then((data)=>{
     this.setState({
       topGenre: data,
       topCity: findCities.findCities(data, this.state.allCities),
    });     
   });

}
  
  render() {
    return (
      <div className="App">
        <a href={LOGIN_URI}> Login to Spotify </a>
        <div>
          Hello { this.state.user.displayName }
        </div>
        <div>
          <img src={this.state.user.profilePic} style={{ height: 150 }}/>
        </div>
        
      { this.state.loggedIn &&
        <button onClick={() => this.getGenreInfo()}>
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