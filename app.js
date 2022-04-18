require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

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
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    const artistQuery = req.query.q;
    spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
      res.render('artistSearch' , { artists : data.body.artists });
    })
    .catch(err => console.log('Error while searching artists: ', err));
});

app.get('/albums/:id?', (req, res) => {
    const artistID = req.params.id;
    spotifyApi
    .getArtistAlbums(artistID)
    .then(data => {
      res.render('albums' , { albums : data.body.items });      
    })
    .catch(err => console.log('Error while searching albums: ', err));    
});

app.get('/tracklist/:id?', (req, res) => {
    const albumID = req.params.id;

    spotifyApi
    .getAlbumTracks(albumID)
    .then(data => {
      res.render('tracklist' , { tracks : data.body.items });      
    })
    .catch(err => console.log('Error while searching tracks: ', err));    
});

app.listen(3000, () => console.log('Spotify API Search Tool @ :3000'));