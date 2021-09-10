require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const id = req.params.artistId;
  console.log(id)
  spotifyApi
  .getArtist(id)
  .then(artist => {
    console.log("extract artist name from: ", artist)
    spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      console.log('received data from albums: ', data.body)
      console.log(artist)
      res.render("albums", {data, artist})
    })
    .catch(err => console.log('error while getting albums: ', err));
  })
  .catch(err => console.log('error while getting artist name: ', err));

});

app.get('/tracks/:albumId', (req, res, next) => {
  const id = req.params.albumId;
  console.log(id)
  spotifyApi
  .getAlbum(id)
  .then(album => {
    console.log("extract album name from: ", album)
    spotifyApi
    .getAlbumTracks(id, 'US')
    .then(data => {
      console.log('received data from tracks: ', data.body)
      console.log(album)
      res.render("tracks", {data, album})
    })
    .catch(err => console.log('error while getting tracks: ', err));
  })
  .catch(err => console.log('error while getting album name: ', err));

});

app.get('/artist-search', 
  (req, res) => {
    const artist = req.query.artist
    console.log(artist)
    spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results", {data, artist})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));  
})

app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
