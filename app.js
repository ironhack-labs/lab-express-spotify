require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(err => console.log('Something went wrong when retrieving an access token', err));
// Our routes go here:

app.get('/', (req, res) => {
    res.render('homepage');
  });

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            //console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', data.body.artists.items)
            })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('Artist albums', data.body);
            res.render('albums', data.body.items);

        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            //console.log('Album tracks', data.body);
            res.render('tracks', data.body.items);
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
  });

app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
