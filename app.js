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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/artist-search', (req, res) => {
    const { artist_name } = req.query
    console.log(artist_name)

    spotifyApi
        .searchArtists(artist_name)
        .then(data => {
            const info = data.body.artists.items
            const img = data.body.artists.items.images
            //console.log('The received data from the API: ', data.body.artists.items);
            res.render('artist-result', { info, img })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log(data.body)
            const albums = data.body.items
            res.render('albums', { albumsById: albums })
            // res.render('albums', data.body)

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
