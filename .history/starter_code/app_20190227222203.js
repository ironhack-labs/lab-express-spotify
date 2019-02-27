const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-js');
const spoty         = new SpotifyWebApi();

// require spotify-web-api-node package here:
const clientId     = '1c30624cba6742dcb792991caecae571',
      clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
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
const index = require('./routes/index');
app.use('/', index);


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
