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
  

// Middleware for parsing json and form-data requests
app.use(express.json());
app.use(express.urlencoded( {extended: false} ));

// Before routes

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');  
});

app.get('/artist-search', (req, res) => {
    const artistQuery = req.query.artist;

    spotifyApi
  .searchArtists(artistQuery)
  .then((data) => {
    const arrayOfArtistObjects = data.body.artists.items;
    res.render('artist-search-results', {artists:arrayOfArtistObjects});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));


});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)     
        .then((data) => {
            const arrayOfAlbums = data.body.items;
            res.render('albums', {albums: arrayOfAlbums})
        })
        .catch(err => console.log(err))  
});

app.get('/tracks/:albumId', (req, res) => {


     spotifyApi.getAlbumTracks(req.params.albumId)     
        .then((data) => {
        const arrayOfSongs = data.body.items;    
        res.render('tracks', {tracks: arrayOfSongs})

        })
        .catch(err => console.log(err))   
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


/* 
app.get('/tracks/:albumId', async (req, res) => {


    const ajaj = await spotify.api
*/