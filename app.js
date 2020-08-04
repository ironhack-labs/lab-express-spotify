require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

//Iteration 1--Spotify API Setup 
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//Iteration 3.2.Setting the partial path
hbs.registerPartials(__dirname + "/views/partials")

//Iteration 1--Spotify API Setup 
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
//Iteration 3.1--Home Page. Rendering Home Page from the server
app.get('/', (req, res) => {
    res.render('index')
})
//Iteration 3.2--Artist Search. Rendering Artist Search from the spotifyApi using their searchArtists method
app.get('/artist-search', (req, res) => {
    
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items)
            res.render('artist-search-results', {artist: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})
//Iteration 4--Albums.Rendering Albums from the spotifyApi using their getArtistAlbums method
app.get('/albums/:artistId', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received data from the API2: ', data.body.items)
            res.render('albums', {albums: data.body.items})
        })
        .catch(err => console.log('The error while searching albums occurred: ', err))
})
//Iteration 5--Tracks.Rendering Tracks from the spotifyApi using their getAlbumTracks method
app.get('/tracks/:trackId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            console.log('The received data from the API3: ', data.body.items)
            res.render('tracks', {tracks: data.body.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
