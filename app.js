require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Config Partials
hbs.registerPartials(__dirname + '/views/partials')

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
app.get('/', (req, res,next) => {
    res.render('home');
});

app.get('/artist-search', (req, res, next) => {
    console.log(req.query)
    const {search} = req.query;

    spotifyApi
        .searchArtists(search)
        .then(data => {
            console.log('data', data.body.artists.items[0]);
            res.render('resultArtist',{albums: data.body.artists.items});
        })
        .catch(error => {
            console.log(error);
            res.send('error');
        })
})

app.get('/albums/:artistId',(req, res, next)=>{
    const {artistId} = req.params;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log('data', data);
            res.render('albumList',{albums: data.body.items});
        })
        .catch(error => {
            console.log(error);
            res.send('error');
        })
});

app.get ('/tracks/:albumId',(req, res, next)=>{
    const {albumId} = req.params;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log('data', data.body.items);
            res.render('tracks',{tracks: data.body.items});
        })
        .catch(error => {
            console.log(error);
            res.send('error');
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
