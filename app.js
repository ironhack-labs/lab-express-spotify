require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get('/', (req, res, next) => res.render('index'));
app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('artist-search-results', {artists: artists});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id).then(
        function(data) {
          console.log('Artist albums', data.body.items);
          const albums = data.body.items;
          res.render('albums', {albums: albums});
        },
        function(err) {
          console.error(err);
        }
    );
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));