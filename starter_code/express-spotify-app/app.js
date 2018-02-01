var express = require('express');
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');
const expressLayouts = require('express-ejs-layouts');

// Remember to paste here your credentials
var clientId = '7fd8b421cae741e48b42fbb919383c8b',
    clientSecret = 'bac7ced4503646d5a24ec68847d99c48';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.use(express.static(__dirname + '/public'))

app.set(expressLayouts)
app.set('layout', 'layouts/index')
//absolute path pointing to views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.get('/', (req, res, next) => {

    res.render('home');

});

app.listen(3000, () => {
    console.log('My Spotify API listening on port 3000!')
});