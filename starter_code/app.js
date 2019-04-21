const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

// setting the spotify-api goes here:
const clientId = 'c8cfaabda26d41c19a78c8ca6f80101b',
    clientSecret = '18c19c07781c471481fd40b15e109be1';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })
  
  
  
  
  // the routes go here:
app.get('/', (req, res) => {
  res.render('index')
})
app.post('/artists', (req, res, next) => {
  const { artist } = req.body
  spotifyApi.searchArtists(artist)
  .then(data => {
    const { items } = data.body.artists
    console.log('name'+{name}); 
    // res.send({name})
    res.send(data.body.artists.items)
    console.log("The received data from the API: ", data.body);
   })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})
  
  
  
  
  app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
  