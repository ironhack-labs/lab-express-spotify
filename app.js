require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });

    // the routes go here:
    
    
    app.get('/artists', (req, res, next) => {
      spotifyApi
      .searchArtists(req.query.artistSearch)
  .then(data => {
    console.log("The received data from the API: ", data.body.artists.items[0]);
  res.render('artists', {artistsList: data.body.artists.items});
})
.catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})

app.get("/albums/:id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    console.log(data.body.items);
    //  console.log('Artist albums', data.body.id.albums);
    res.render('albums', {albumsList: data.body.items});
  }, function(err) {
    console.error(err);
  });
});


app.get("/albums/:id/tracks", (req, res, next) => {
  
  spotifyApi.getAlbumTracks(req.params.id)
  .then(function(data) {
    console.log(data.body.items);
    res.render('tracks', {tracksList: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.use('/', (req, res, next) => {
  res.render('index')
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
