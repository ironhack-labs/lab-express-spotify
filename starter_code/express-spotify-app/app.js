var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const expressLayouts = require('express-ejs-layouts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressLayouts);
app.set('views', __dirname + '/views');
//app.set('layout', 'layouts/main-layout');
app.set('view engine','ejs');
app.use(express.static('public'));

// Remember to paste here your credentials
var clientId = '0b37b3990fed4043a05be442fa3ee3db',
    clientSecret = '0a4c4c84e5cc40539a3dbf00a17a2ef5';

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

app.post('/artist', (req, res, next) => {
    //res.send(req.body.artist);
    spotifyApi.searchArtists(req.body.artist)
    .then((response) => {
        //res.send(response);
        res.render('artist', {
            data: response,
            keyword: req.body.artist
        });
    }).catch((err) => {

    });
    
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
        //res.send(data.body);
        res.render('albums', {
            data: data.body,
            artist: data.body.items[0].artists[0].name
        });
    }, function(err) {
        console.error(err);
    });
    //res.render(req.params);
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
        //res.send(data.body);
        res.render('tracks', {
            data: data.body,
            album: req.query.album,
            artist: data.body.items[0].artists[0].name
        });
    }, function(err) {
        console.error(err);
    });
    //res.render(req.params);
});

app.listen(3000, () => { 
    console.log('server started');
});