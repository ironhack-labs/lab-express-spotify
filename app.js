require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const SpotifyWebApi = require('spotify-web-api-node');

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

app.get("/", (req,res) => {
    res.render("index")
})
app.get("/artist-search",  (req,res) => {
const searchArtists  = req.query.Artista

spotifyApi
  .searchArtists(searchArtists)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artist = data.body.artists.items;
    res.render("artist-search-results", { artist })
    console.log (data.body.artists.items)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    const id = req.params.artistId
    spotifyApi
  .getArtistAlbums(id)
  .then(function(data) {
    const albums = data.body.items;
    console.log('Artist albums', data.body);
    res.render("albums", {albums})

  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req,res) => {
    const id = req.params.albumId
    spotifyApi.getAlbumTracks(id)
  .then((data) => { const tracks = data.body.items
    res.render("tracks", {tracks});
    console.log(tracks[0])
  }) .catch(err =>
    console.log('Something went wrong!', err)
  );
  })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

