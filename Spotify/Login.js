/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
 
var express = require('express'); // Express web server framework
 var request = require('request'); // "Request" library
 var querystring = require('querystring');
 var cookieParser = require('cookie-parser');
 var fs = require('fs');


 var client_id = 'e5a2287a5ea14d379ec2ea832d4760a4'; // Your client id
 var client_secret =  'dbc2ab802d694e55ab516a43f89c921c'; // Your secret
 var redirect_uri = 'http://localhost:8888/callback'; // Or Your redirect uri
 
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
 
 app.use(express.static(__dirname + '/public'))
    .use(cookieParser());
 
 app.get('/login', function(req, res) {
 
   var state = generateRandomString(16);
   res.cookie(stateKey, state);
 
   // your application requests authorization
   var scope = 'user-read-private user-read-email user-top-read ';
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
 
        
        //  var optionsGenre = {
        //   url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20&offset=0',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };
        // // use the access token to access the Spotify Web API
        // request.get(optionsGenre, function(error, response, body) {
        //   const userData = JSON.stringify(body);
        //   fs.writeFile('./data/user.json', userData, 'utf8', (err) => { //writes user genre data to a json file
        //     if (err) {
        //         console.log(`Error writing file: ${err}`);
        //     } else {
        //       findCities.findCities();
        //        console.log(`File is written successfully!`);
        //     }
        
        // });
        // });

         // we can also pass the token to the browser to make requests from there
         res.redirect('http://localhost:3000/#' +
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
 
 app.get('/refresh_token', function(req, res) {
 
   // requesting access token from refresh token
   var refresh_token = req.query.refresh_token;
   var authOptions = {
     url: 'https://accounts.spotify.com/api/token',
     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
     form: {
       grant_type: 'refresh_token',
       refresh_token: refresh_token
     },
     json: true
   };
 
   request.post(authOptions, function(error, response, body) {
     if (!error && response.statusCode === 200) {
       var access_token = body.access_token;
       res.send({
         'access_token': access_token
       });
     }
   });
 });
 
 console.log('Listening on 8888');
 app.listen(8888);