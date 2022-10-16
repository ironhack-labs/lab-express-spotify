require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong', error));

// Our routes go here:
app.get('/', (req,res,next) =>{
    res.render('home')
})

app.get('/artist-search',(req,res,next) => {
    spotifyApi.searchArtists('artist')
    .then((response) => {
        res.render('artist-search-results', {
            details: response.body.artists.items,
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/albums/:artistId',(req,res,next) => {
    let {artistId} = req.params

    spotifyApi.getArtistAlbums(artistId)
    .then((response) => {
        console.log(response.body.items);
        res.render('albums.hbs',{
            eachAlbum: response.body
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/tracks/:artistId', (req,res,next) => {
    let {artistId} = req.params

    spotifyApi.getAlbumTracks(artistId, {limit:5,offset:1})
    .then((response) => {
        res.render('audio.hbs', {
            eachAudio: response.body.items
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
