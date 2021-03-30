import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

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
      user: {displayName:'not logged in', profilePic:''}
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getUserGenres(){
    return '';
  }
  getUserInfo(){ //call to get user infomation from spotify api
      spotifyApi.getMe()
      .then((data) => {
        console.log(data);
        this.setState({
          user: { 
              displayName: data.display_name, 
              profilePic: data.images[0].url
            }
        });
      })
  }
  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888/login' > Login to Spotify </a>
        <div>
          {this.state.loggedIn ? this.getUserInfo() : ''}
          Hello { this.state.user.displayName }
        </div>
        <div>
          <img src={this.state.user.profilePic} style={{ height: 150 }}/>
        </div>
      </div>
    );
  }
}
export default App;