require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        const token = spotifyApi.setAccessToken(data.body['access_token'])
        return token;
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res) => {
    res.render('homepage')
    console.log('/works')
})

app.get('/artist-search', (req, res) => {
    console.log(req.query.search)
    spotifyApi.searchArtists(req.query.search)
    //.then( data => console.log(data.body.artists.items))
    .then( data => res.render('artists', {
        info: data.body.artists.items
    }))
})

app.get('/albums/:id', (req, res) => {
    console.log(req.params.id)
    spotifyApi.getArtistAlbums(req.params.id)
    //.then ( data => console.log(data.body.items))
    .then( data => res.render('albums', {
       info: data.body.items
    }))
})

app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then( data => res.render('tracks', {
        info: data.body.items
    }))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
