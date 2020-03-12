require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials")

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET

});
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            res.render('artists', data.body.artists.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});
app.get('/artist-search/:artist', (req, res, next) => {
    console.log("req artist!")
    spotifyApi.getArtistAlbums(req.params.artist)
        .then(data => {
            res.render('album', data.body.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.get('/album-search/:album', (req, res, next) => {
    console.log("req album!")
    spotifyApi.getAlbumTracks(req.params.album)
        .then(data => {
            console.log("song array",data.body.items)
            res.render('songs', data.body.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

