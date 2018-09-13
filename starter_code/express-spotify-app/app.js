var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require('path');

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));


// Remember to paste here your credentials
var clientId = '5e63bb682c7840359716b049172bd6ca',
    clientSecret = '54a348031c4d42fca350f08fbd719276';



// Creación de página de inicio y de ruta de artista
app.get('/', (req, res) => {
    res.render('index')
});
app.get('/artists', (req, res) => {
    let artist = req.query.artist
    spotifyApi.searchArtists(artist)
        .then(data => {

            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
});


app.listen('3000') // puerto 3000 a la escucha

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });