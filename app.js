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

//Retrieve a access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    const artist = req.query.artist;
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render('artist-search-results', { artistData: data.body.artists.items });
        })
        .catch(error => console.log('The error while searching artists occurred: ', error));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log('Artists Albums: ', data.body);
            res.render('albums', { artistsAlbums: data.body.items });
        })
        .catch(error => console.log('The error while get the albums of the artist: ', error));

});

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log('Tracks for an album: ', data.body);
            res.render('tracks', { albumTracks: data.body.items });
        })
        .catch(error => console.log('The error while get the tracks of an album: ', error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));