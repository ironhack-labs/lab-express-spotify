require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
const chalk = require('chalk')

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
  
//   Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log(chalk.red.inverse('Something went wrong when retrieving an access token', error)));

// Our routes go here:
app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/artist-search', (req, res)=>{
    spotifyApi.searchArtists(req.query.searchArtist)
    .then((result) => {
        res.render('artist-search-results', {data: result.body.artists.items})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/albums/:artistId', (req, res)=>{
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then((result)=>{
        res.render('albums', {data: result.body.items})
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get('/tracks/:albumId', (req, res)=>{
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then((result)=>{
        res.render('tracks', {data: result.body.items})
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
