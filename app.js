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
//To render Home page
app.get('/', (req, res, next) => {
    res.render('home');
});
//To display results for artist search
app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        const artistInfo = data.body.artists.items;
        res.render('artist-search-results', {
            artists: artistInfo
    });
})
.catch(error => console.log('The following error has occured while searching artists: ', error));
});
//To display albums
app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;

    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        const albumInfo = data.body.items;
        res.render('albums', {
            albums: albumInfo
        });
    })
    .catch(error => console.log('The following error has occured while searching albums: ', error));
});
//To display tracks
app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        const trackInfo = data.body.items;
        res.render('tracks', {
            tracks: trackInfo
        });
    })
    .catch(error => console.log('The following error has occurred while searching tracks: ', error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
