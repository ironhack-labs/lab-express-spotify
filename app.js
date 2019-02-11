const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const mongoose = require('mongoose')

const app = express();
// require spotify-web-api-node package here:
// Remember to insert your credentials here
const clientId = 'aa2898f27f334e6795cf7ea04057ce27',
    clientSecret = 'f12f7e5140e94658bdc093f2e7d69a26';

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

  spotifyApi.getArtistAlbums()
  .then()
  .catch()




app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/Spotify', {useNewUrlParser:true})
// setting the spotify-api goes here:



// the routes go here:
let index = require ('./routes/index')
app.use("/", index)


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
