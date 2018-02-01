var express = require('express');
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');
const expressLayouts = require('express-ejs-layouts');

// Remember to paste here your credentials
var clientId = "616a1dccb0b54728b0c05a04ff0d4fa5",
    clientSecret =  "d09d99f4a31942d5b8595710a9a744ab";

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.get('/', (req, res, next) => {
    // Retrieve a random chuck joke
    res.render("index");
});

app.listen(3000);

