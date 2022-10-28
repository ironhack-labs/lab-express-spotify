require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
    res.render('home');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist) 
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images);
            res.render("artist-search-results", { result: data.body.artists.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params
    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
            console.log('The received data from id', data.body.items)
            res.render("albums", { result: data.body.items });
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get("/tracks/:id", (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log(data.body.items)
            res.render("tracks", {
                tracks: data.body.items
            })
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
