require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(function (data) {
            console.log(data.body.artists.items[0].images[0].url);
            res.render('artist-search-results', { artists: data.body.artists.items });
        }, function (err) {
            console.error(err);
        });
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function (data) {
            console.log(data.body.items);
            res.render('albums', { albums: data.body.items });
        }, function (err) {
            console.error(err);
        });
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(function (data) {
            console.log(data.body.items);
            res.render('tracks', { tracks: data.body.items });
        }, function (err) {
            console.error(err);
        });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

// {
//     external_urls: {
//       spotify: 'https://open.spotify.com/artist/1co4F2pPNH8JjTutZkmgSm'
//     },
//     followers: { href: null, total: 1673521 },
//     genres: [
//       'classic rock',
//       'early us punk',
//       'permanent wave',
//       'punk',
//       'rock',
//       'skate punk'
//     ],
//     href: 'https://api.spotify.com/v1/artists/1co4F2pPNH8JjTutZkmgSm',
//     id: '1co4F2pPNH8JjTutZkmgSm',
//     images: [ [Object], [Object], [Object] ],
//     name: 'Ramones',
//     popularity: 68,
//     type: 'artist',
//     uri: 'spotify:artist:1co4F2pPNH8JjTutZkmgSm'
//   },
