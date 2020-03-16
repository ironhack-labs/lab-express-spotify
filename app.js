require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get("/results", (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist) 
    .then(data => {
        
        let spotyList = data.body.artists.items
        //console.log('The recieved data from the API: ', spotyList);
         res.render('results', {spotyList})
    })
        .catch(error => console.error(error));
    ;
});

app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    //console.log(req.params.id)
    .then(data => {
        
        let spotyAlbums = data.body.items
        //console.log(spotyAlbums);
         res.render('albums', {spotyAlbums})
    })
        .catch(error => console.error(error));
});


app.get('/tracks/:id', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
    //console.log(req.params.id)
    .then(data => {
        
        let spotyTracks = data.body.items
        console.log(spotyTracks);
         res.render('tracks', {spotyTracks})
    })
        .catch(error => console.error(error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
