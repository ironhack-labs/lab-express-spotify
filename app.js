require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get('/', (req, res, next) => {
    res.render('index');
});



app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then((data) => {
      //console.log("The received data from the API: ", data.body.artists.items);
      let allArtist = data.body.artists.items;
      res.render("artist-search-results", { allArtist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  //
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('Artist albums', data.body.items);
    let allAlbums = data.body.items;
    res.render("albums", { allAlbums });
  }, function(err) {
    console.error(err);
  });

});

app.get('/tracks/:id', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    console.log('Tracks', data.body.items);
    let allTracks = data.body.items;
    res.render("tracks", { allTracks });
  }, function(err) {
    console.log('Something went wrong!', err);
  });

}); 

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
