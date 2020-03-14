require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//partialssss

hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
})


app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            let artist = data.body.artists.items;
            console.log('The received data from the API: ', artist);
            res.render('artist-search', {
               artist
            });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums-search/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(albums => {
      res.render('albums-search', {albums: albums.body.items})
  })
  .catch(error => console.log(error));
})


app.get('/tracks-search/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(tracks => {
        console.log(tracks);
      res.render('tracks-search', {tracks: tracks.body.items})
  })
  .catch(error => console.log(error));
})



app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));