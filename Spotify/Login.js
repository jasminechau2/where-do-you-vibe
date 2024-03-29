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
 var cors = require('cors');
 var querystring = require('querystring');
 var cookieParser = require('cookie-parser');
 const http = require("http");
 
 const PORT = process.env.PORT || 8888;
 const path = require('path');
 require('dotenv').config();
 

 var client_id = process.env.REACT_APP_CLIENT_ID; // Your client id
 var client_secret =  process.env.REACT_APP_CLIENT_SECRET; // Your secret
 var redirect_uri  = process.env.REDIRECT_URI;
 var FRONTEND_URI = process.env.FRONTEND_URI;

if (process.env.NODE_ENV !== 'production') {
  redirect_uri = 'http://localhost:8888/callback';
  FRONTEND_URI = 'http://localhost:3000';
} 

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
 var refreshKey = "refresh_key";

 const app = express();

 // Resolve client build directory as absolute path to avoid errors in express
const buildPath = path.resolve(__dirname, "../client/build");

 app.use(express.static(buildPath))
  .use(cors())
  .use(cookieParser());

  const cookieOption = {
    expire: 3600000 + Date.now(),
  };

 app.get('/login', function(req, res) {
 
   var state = generateRandomString(16);
   res.cookie(stateKey, state);
 
   // your application requests authorization and gets redirected to wheredoyouvibe.com
   var scope = 'user-read-private user-read-email user-top-read ';
   res.redirect('https://accounts.spotify.com/authorize?' +
     querystring.stringify({
       response_type: 'code',
       client_id: client_id,
       scope: scope,
       redirect_uri: redirect_uri,
       state: state,
      show_dialog: true
     }));
 });
 
 app.get('/callback', function(req, res) {
 
   // your application requests refresh and access tokens
   // after checking the state parameter
 
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;
 
   if (state === null || state !== storedState) {
    res.redirect(
      `${FRONTEND_URI}/`,
    );
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

     //request get token
     request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        //pass token as a cookie that expires in an hour
        res.cookie( "access_token", access_token, cookieOption);

        res.redirect(
          `${FRONTEND_URI}/`,
        );
      } else {
        res.redirect(`${FRONTEND_URI}/`,);
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
 
   request.post(authOptions, function(error, response, body) { //sets the cookie 
     if (!error && response.statusCode === 200) {
       var access_token = body.access_token;
       res.cookie( "access_token", access_token, {expires: 3600000 + Date.now()})
     }
   });
 });

 app.get('/logout', function(req, res) {
   //logout bu deleting the access_token from the cookies 
  refreshKey = req.query.refresh_token;

  res.clearCookie("access_token", cookieOption);

  res.redirect(
    `${FRONTEND_URI}/`,
  ); 
});
 
 if (process.env.NODE_ENV === "production") {
  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (request, response) => {
    response.sendFile(path.join(buildPath, "index.html"));
  });
}
 app.listen(PORT);
 console.log("Listening on port %d", PORT); // eslint-disable-line no-console

 //references
 // https://flaviocopes.com/cookies/#samesite
 // https://alligator.io/nodejs/express-cookies/
 // https://www.tutorialspoint.com/javascript/javascript_cookies.htm