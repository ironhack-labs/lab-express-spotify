var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs     = require('hbs');
const app     = express();
const path = require('path')

//Set up views layout engine 
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + "/views/partials")

var clientId = '2b681dbccc1e4afe8c72cf8e3c847614',
    clientSecret = '36ce71f4635c4cecabc84fd8610a7522';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
  console.log('Spotify app received a get index!');
  res.render('index');
});


app.get('/artist', (req, res, next) => {
  const artist = req.query.artist;
  spotifyApi.searchArtists(artist)
    .then(data => {      
      let artistList =data.body.artists.items
      res.render("artist", {artistList})

    })
    .catch(err => {
      console.log("an error occurred", err)
    })
});



app.listen(3000,() => console.log('Spotify app listening on port 3000!'))