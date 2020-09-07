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
app.get('/', (req, res) => {
    console.log('home')
    res.render('home-page')
})

app.get('/artist-search', (req, res) => {
    console.log(req.query)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {searchedArt: data.body.artists.items} )
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/:artistId/albums', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log('Artist albums', data.body.items);
        res.render('albums', {artistAlbums: data.body.items})
    })
    .catch(err => console.log('Error while getting Albums', err))
});
  
app.get('/:albumId/tracks', (req, res, next) => {
    // console.log(req.params.albumId);
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then (data => {
        console.log('Data from the API:', data.body.items);
        res.render('tracks', {tracksPage: data.body.items})
    })
    .catch (err => console.log('Error while getting tracks', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
