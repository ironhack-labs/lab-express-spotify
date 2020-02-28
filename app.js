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
app.get("/", (req, res) => {
  res.render("index")
});

app.get('/artist-search', (req, res) => {
  const { artist = 'no existe' } = req.query
  // const artist = req.query.artist
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log('Artist: ', data.body.artists.items)
      const artistList = data.body.artists.items;
      res.render("artist-search-result", { artistList });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  console.log(req.params.artistId)
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('Artist albums: ', data.body.items);
    const artistAlbums = data.body.items
    res.render("albums", { artistAlbums })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:albumsId', (req, res, next) => {
  console.log(req.params.albumsId)
  spotifyApi
  .getAlbumTracks(req.params.albumsId)
    .then(data => {
      console.log('Artist songs: ', data.body.items)
      const artistSongs = data.body.items
      res.render('tracks', { artistSongs })
   })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
