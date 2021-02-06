require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;

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

app.get('/', (req,res) => {
    res.render('index');
})

app.get('/artist-search', (req, res) => {

   spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const infoArtist = data.body.artists.items;
    res.render('artist-search-results', { infoArtist: infoArtist })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res) => {

    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        const artistName = data.body.items[0].artists[0].name;
        const albumsArtist = data.body.items.filter(album => album.available_markets.includes('DE'));
        res.render('albums', { albums: albumsArtist, name: artistName })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/tracks/:tracksId', (req, res) => {

  spotifyApi
  .getAlbumTracks(req.params.tracksId,  { limit : 20, offset : 1 })
  .then(data => {
      const albumTracks = data.body.items;
      res.render('tracks', { tracks: albumTracks })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(PORT, () => 

console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')

);

