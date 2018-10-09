var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


// Remember to paste here your credentials
var clientId = 'dfafbf63e34e406b8eb6fe32aa0cf313',
    clientSecret = '1556d6e3a2fb46bf8a02bb1510710895';

var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) =>{
    let search = req.query.artist;
    spotifyApi.searchArtists(search)
        .then(data => {
            let artist = data.body.artists.items;
            res.render('artists',{artist})

        })
        .catch(err => {
           console.log(err)
        })
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            let albums = data.body.items;
              res.render('albums',{albums})
        })
        .catch(err => {
            console.log(err)
        })
});

app.get('/tracks/:albumId', (req,res) =>{
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            let tracks = data.body.items;
            res.render('tracks',{tracks})

        })
        .catch(err=> {
            console.log(err)
        })
})


app.listen(3000);
