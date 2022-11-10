require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
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
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    // console.log(artist)
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            // console.log(data.body.artists.items);

            const items = data.body.artists.items

            // console.log(item.images)
            console.log(items)
            // res.send(items)
            res.render('artist-search-results', { artistsInfo: items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params
    // console.log(artistId)
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // console.log('Artist Albums', data.body)
            // res.send(data.body)
            res.render('albums', { album: data.body.items })

        })
        .catch(err => console.log('The error while searching album occurred: ', err));
})
app.get('/tracks/:albumId', (req, res) => {
    const { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            // console.log(data.body)
            // res.send(data.body)
            res.render('tracks', { track: data.body.items })
        })
        .catch(err => console.log('The error while searching track occurred: ', err));

})

app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
