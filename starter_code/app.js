const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node")

// require spotify-web-api-node package here:
const clientId = 'a81a8381c0934c85b28c9541fa51b216',
  clientSecret = 'a2c50de272d14f6787d39ac5d00c01e4';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
/* const Spotify = require('spotify-web-api-js');
const s = new Spotify() */

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    console.log(data)
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:






// the routes go here:
app.get('/', (req, res, next) => res.render('home'))



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
