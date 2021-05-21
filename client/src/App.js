import React, { Component } from 'react';
import Map from './components/Map.js';
import SpotifyWebApi from 'spotify-web-api-js'; //https://github.com/thelinmichael/spotify-web-api-node
import cities from './places.json';
import latLng from './lat-lng.json'

import UserCityList from './components/user-cities-display-template';


const spotifyApi = new SpotifyWebApi(); 
var findCities = require('./compare-artists.js');

const LOGIN_URI =
process.env.NODE_ENV !== 'production'
? 'http://localhost:8888/login'
: 'https://www.wheredoyouvibe.com/login';
//'https://where-do-you-vibe.herokuapp.com/login';

const LOGOUT_URI =
process.env.NODE_ENV !== 'production'
? 'http://localhost:8888/logout'
: 'https://www.wheredoyouvibe.com/logout';
//'https://where-do-you-vibe.herokuapp.com/logout';

class App extends Component { 
  constructor(){
    super();
    const tokens = document.cookie.split(';')
    const access_tok = tokens[0].split('=');

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

  componentDidMount(){ //makes the calls after the states are set
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

  getGenreInfo(time){ // call to get top artist of a user
    spotifyApi.getMyTopArtists({time_range: time, limit: 50})
    .then((data)=>{
      this.setState({algoGeneration: findCities.findCities(data, this.state.allCities)});
      this.setState({
        topGenre: this.state.algoGeneration[2],
        genresGenerated: true,
        points: this.getCitiesLatLng()
      }); 
    });

  };

  getCitiesLatLng(){ //get the latitiude and longtitude 
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

        {/* add link for where do remove spotify access "You can disconnect this project from your Spotify account here under the app name “Bad Music”. This project does not store any Spotify data.
        https://www.spotify.com/us/account/apps/
        " */}
        <ul className = "navigation">
          <li>Where's { this.state.user.displayName } vibe? </li>
          <li className = "login-button-wrapper">
            {this.state.loggedIn ? <a className="spotify-style" href = {LOGOUT_URI}>logout</a> : <a className="spotify-style" href={LOGIN_URI}> login to Spotify </a>}
          </li>
        </ul>

        { this.state.loggedIn && !this.state.genresGenerated &&
          <div className="main-display-wrapper" style={{
            backgroundColor:"yellow"
          }}>
          <p>
            We need to talk to you about our algorithm. While we were building this site we realized that it takes our 
            opinion on how matching should work and then displays it to you as truth. 
          </p>   
          <a href="https://www.youtube.com/watch?v=heQzqX35c9A" style={{
            textDecoration:"underline",
            textColor:"black"
          }}>Isn't that what all algorithms do?</a>     
        </div>
        }

        { this.state.loggedIn && !this.state.genresGenerated &&
           <div className="main-display-wrapper">
            <h2>Find a match for the music you've listened to...</h2>
            <button className="spotify-style" onClick={() => this.getGenreInfo('short_term')}>
            this month
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('medium_term')}>
            the last six months
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('long_term')}>
            since you got Spotify
            </button>
            <div>
            </div>
          </div>
        }

      {!this.state.loggedIn && !this.state.genresGenerated && 
      <div>
        <div className="main-text-wrapper" > 
          <h2>Hi! We are Jasmine and Zack.</h2>
          <p>
            We are seniors at Middlebury College in Vermont. As we were looking at jobs, we found it difficult to figure out the "vibes" of cities that we could move to. So we did the reasonable CS major thing and made a whole a** website. And this is that. Welcome.
            Here is how it works:
          </p>
          <ol>
            <li>You click the login button up above</li>
            <li>Spotify recognizes our site and gives us permission to ask for your listening history</li>
            <li>We store this "permission slip" in your brower's cookies (don't worry, this is the only thing we use cookies for, we don't track you)</li>
            <li>Our site sends Spotify your token along with a request to see your listening history for the period you specify</li>
            <li>Spotify gives us the requested information -- and nothing else</li>
            <li>We run our algorithm on your data and display a list of cities so you can question your life choices</li>
          </ol>
        </div>
        <div className="main-text-wrapper">
          <a href="https://everynoise.com/everyplace.cgi">Our city genre data is from Glenn McDonald's Every Place at Once</a>
        </div>
      </div>
       
      }

      { this.state.loggedIn && this.state.genresGenerated &&
        <div>
          <UserCityList citiesObject = {this.state.algoGeneration} callback = {(selectedCity) => this.setState({topCity: selectedCity})}/>
          <div className="main-display-wrapper">
            <button className="spotify-style" onClick={() => this.getGenreInfo('short_term')}>
            this month
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('medium_term')}>
            the last six months
            </button>
            <button className="spotify-style" onClick={() => this.getGenreInfo('long_term')}>
            since you got Spotify
            </button>
            <div>
            </div>
          </div>
          <div className="map-wrapper">
            <Map cityLocations = {this.state.points} cityInfo={this.state.algoGeneration} cityDetails = {this.state.allCities["items"]} />
          </div>
        </div>
      }

  
      { (this.state.genresGenerated || !this.state.loggedIn) &&
       <div className="main-text-wrapper">
        <p> If you are curious about how we found your match, we are happy to share! You can send us an email at jchau [at] middlebury [dot] edu and zeinhorn [at] middlebury [dot] edu. Or if you are technially savvy, we didn't compress our code and it is visible if you inspect this page :)</p>
       </div>
      }
      

        </div>
      );
  }
}
export default App;

//references
// https://www.joekarlsson.com/2019/04/how-to-build-a-spotify-player-with-react-in-15-minutes/
// https://medium.com/@jonnykalambay/now-playing-using-spotifys-awesome-api-with-react-7db8173a7b13
