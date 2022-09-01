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
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    //res.send('canciones');
    const { artist } = req.query
    console.log(artist)

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const { items } = data.body.artists

            res.render('artist_search_results', { items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params.artistId);
    const artistId = req.params.artistId

    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
            const albumData = data.body.items
            //console.log('ESTOY AQUIIIIII', { items });

            res.render('albums', { albumData });
            //  console.log('Artist albums', album);
        })
        .catch(err => console.error(err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    console.log(req.params.albumId);
    const albumId = req.params.albumId

    spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then((data) => {
            console.log('Artist!!!!!!!!', data.body)
            const trackData = data.body.items
            res.render('tracks', { trackData });
        })
        .catch(err => console.error(err));
});








app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
