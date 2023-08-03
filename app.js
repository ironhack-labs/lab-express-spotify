require('dotenv').config();
const PORT = process.env.PORT || 5005
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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistname)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images[0]);
            res.render('artist-search-results', { items: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            res.render('albums', { items: data.body.items });
            console.log(data.body.items);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            res.render('tracks', { items: data.body.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(PORT, () => console.log(`My Spotify project running on ${PORT} 🎧 🥁 🎸 🔊`));
