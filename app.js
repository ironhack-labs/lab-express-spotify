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

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/artist', (req, res, next) => {
    const search = req.query.artist;
    spotifyApi
        .searchArtists(search)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items);
            const artists = data.body.artists.items;
            res.render('artist', { artists });
        })
        .catch(error => console.log('The error while searching artists occurred: ', error));
});

app.get('/album/:artistId', (req, res, next) => {
    const album = req.params.artistId;
    spotifyApi
        .getArtistAlbums(album)
        .then(data => {
            const albums = data.body.items;
            res.render('album', { albums });
        })
        .catch(error => console.log('The error while searching albums occurred: ', error));
})

app.get('/track/:albumId', (req, res, next) => {
    const track = req.params.albumId;
    spotifyApi
        .getAlbumTracks(track)
        .then(data => {
            const tracks = data.body.items;
            res.render('track-information', { tracks });
        })
        .catch(error => console.log(error));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
