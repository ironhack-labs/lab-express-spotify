require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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
    .then(data => {
        console.log('Access token retrieved');
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    let myQuery = req.query.query;

    spotifyApi
        .searchArtists(myQuery)
        .then(data => {
        // console.log('The received data from the API: ', data.body);
        const imageLocation = data.body.artists.items[0];
        // console.log(data.body.artists);
        // console.log(imageLocation.images[0]);
        res.render('artist-search-results', data.body);
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get('/albums/:artistId', (req, res, next) => {
    let myParams = req.params.artistId;

    spotifyApi
        .getArtistAlbums(myParams)
        .then(data => {
        //console.log('Artist Albums:', data.body);
        console.log(data.body.items[0].name);
        console.log(data.body.items[0].images);    
        res.render('albums', data.body);
    })
    .catch(err => console.log('Something went wrong:', err));
});

app.get('/albums/albumTracks/:albumId', (req, res, next) => {
    let albumParams = req.params.albumId;

    spotifyApi
        .getAlbumTracks(albumParams)
        .then(data => {
            console.log('Album Tracks:', data.body);
            res.render('tracks', data.body);
    })
    .catch(err => console.log('An error occurred:', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
