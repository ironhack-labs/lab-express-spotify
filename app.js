require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

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
    res.render('index')
})

app.get('/artist-search', (req, res) => {

    const { artistName } = req.query

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items);
            const info = data.body.artists.items
            res.render('artist-search-results', { info })
        })
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/artist-search-results', (req, res) => {
    res.render('artist-search-results')
})

app.get('/albums/:album_id', (req, res) => {

    const { album_id } = req.params
    // console.log({ album_id })
    spotifyApi
        .getArtistAlbums(album_id)

        .then(data => {
            console.log('The received data from the API: ', data.body.items)
            const albumInfo = data.body.items
            res.render('albums', { albumInfo })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});





app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
