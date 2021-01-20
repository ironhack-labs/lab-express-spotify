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


// setting the spotify-api goes here:


// Our routes go here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.name)
    .then(data => {
        if (data.body.artists.total == 0) {
            res.render('no-results')
        } else {
            console.log(data.body)
            res.render('artist-search-results', { results: data.body })
        }
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:id', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
        res.render('albums', { results: data.body })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('tracks', { results: data.body })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));



