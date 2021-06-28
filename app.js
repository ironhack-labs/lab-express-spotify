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

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/', (req,res) => {
    
    res.render('home')
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.q)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {artistList : data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received albums from the artist ID:', data.body.items);
            res.render('albums.hbs', {albumsList: data.body.items})
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/tracks/:albumId', (req, res, next) => {
    // .getAlbumTracks() code goes here
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('THe received tracks from the album ID:', data.body.items);
            res.render('tracks.hbs', {tracksList: data.body.items})
        })

        .catch(err => console.log('The error while searching artists occurred: ', err));

});


