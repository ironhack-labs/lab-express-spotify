var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    console.log(req.query);
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            console.log(data.body.artists.items);
            var allResults = data.body.artists.items;
            res.render('artists',{info: allResults});
        })
        .catch(err => {
            console.log(error);
        })
});

// Remember to paste here your credentials
var clientId = '8c5bbbcf4fe7491491ec1ed5f248e71f',
    clientSecret = '0deacf7ed6a84ff780ac82196a94884a';

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


app.listen(3000, () => {
    console.log("My first app listening on port 3000!");
});

