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

app.get('/', function(req, res){
    res.render('index')
})

app.get('/artist-search', function(req, res) {
    let searchQuery = req.query.q
    spotifyApi
  .searchArtists(searchQuery)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    const searchArtist = data.body.artists.items
    res.render('artist-search-results', {searchArtist})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
 
})

app.get('/albums/:id', function(req, res) {
    let artistId = req.params.id
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        const artistAlbums = data.body.items
    res.render('albums', {artistAlbums} )
    }) 
})

app.get('/tracks/:id', function(req, res) {
    let albumTracksId = req.params.id

    spotifyApi
    .getAlbumTracks(albumTracksId)
    .then (data => {
        const albumTracks = data.body.items
        res.render('tracks', {albumTracks})
    })
    
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


