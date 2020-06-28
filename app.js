require('dotenv').config();
const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// Express server handling requests and responses
const app = express();

//tell our Express app that HBS will be in charge of rendering the HTML
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Make everything inside of public/ available
app.use(express.static(__dirname + '/public'));

// setting the spotify-api
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));


// Routes
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
