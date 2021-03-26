
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');
const { act } = require('react-dom/test-utils');

const fs = require('fs');
var client_id = 'e5a2287a5ea14d379ec2ea832d4760a4'; // Your client id
var client_secret = 'dbc2ab802d694e55ab516a43f89c921c'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static('public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
   querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
   }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

      console.log(userGenres(access_token));

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));


      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
   
  }
});


const userGenres = (access_token) => {

  var options = {
    url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=5',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    const userData = JSON.stringify(body);
    fs.writeFile('./data/user.json', userData, 'utf8', (err) => {
      if (err) {
          console.log(`Error writing file: ${err}`);
      } else {
          console.log(`File is written successfully!`);
      }
  
  });
  });

}

console.log('Listening on 3000');
app.listen(3000);



