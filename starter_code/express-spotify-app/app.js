const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyparser = require('body-parser')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'b55518b95e334e1aa2d2495b3867ae55',
    clientSecret = '673af2f0c83a4eda81f1441acf0da72b';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.get('/', (req, res, next) => {
    res.render('index')

});
app.post('/artists', (req, res, next) => {
    const search = req.body.artists;


    spotifyApi.searchArtists(req.body.artist)
        .then(artist => {
            artist.body.artists.search = search;
            res.render("artists", artist.body.artists)
            //   // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

        })
        .catch(err => {
            console.log(err);
            // ----> 'HERE WE CAPTURE THE ERROR'
        })

});
app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log(data)
            res.render('albums', data.body);
        })
        .catch(err => {
            console.log(err)
        })
});

app.get('/tracks/:artistId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.artistId)
        .then(data => {
            console.log(data)
            res.render('tracks', data.body);
        })
        .catch(err => {
            console.log(err)
        })
});





const port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`));
