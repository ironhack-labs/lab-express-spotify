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

// HOMEPAGE
app.get('/', (req, res) => {
    res.render('index');
});

// SEARCH Q
app.get('/artist-search', (req, res) => {
    spotifyApi
    
        .searchArtists(req.query.q)
        .then(artistFromDB => {
            console.log('The received data from the API: ', artistFromDB.body.artists.items[0]);
            res.render('artist-search-result', {artists: artistFromDB.body.artists});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


// ALBUM PAGE
app.get('/albums/:myArtistId', (req, res, next) => {
    const artistID = req.params.myArtistId
    console.log(artistID)
    spotifyApi
    .getArtistAlbums(artistID)
    .then (renderedAlbums => {
        console.log(renderedAlbums.body.items)
        res.render('albums', {albums: renderedAlbums.body.items});
    
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });


// TRACK
  app.get('/tracks/:myAlbumId', (req, res, next) => {
    const albumID = req.params.myAlbumId
spotifyApi.getAlbumTracks(albumID, { limit : 5, offset : 1 })
  .then (albumTracks => {
    console.log(albumTracks.body.items);
    res.render('tracks', {tracks: albumTracks.body.items});
  }) 
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });
 


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));