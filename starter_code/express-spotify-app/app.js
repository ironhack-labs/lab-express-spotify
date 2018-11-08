const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('ourHome');
})

app.post('/artists', (req, res) => {
    let artist = req.body.artist;
    //SearchSpotify

    spotifyApi.searchArtists( /*'HERE GOES THE QUERY ARTIST'*/ )
        .then(data => {
            res.render('artists', data);
        })
        .catch(err => {
            // ----> 'HERE WE CAPTURE THE ERROR'
        })
});

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'c5a00d99bb284c45a3251dbc90189608',
    clientSecret = '6521c7cc880547ec809c0e883069d3cb';

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

//listen

app.listen(3000, () => console.log('Example app listening on port 3000!'))