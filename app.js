require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});


spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




app.get("/", (req, res) => {
    res.render("home");
});


app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistSearch)
        .then(data => {
            const artistsArr = data.body.artists.items;
            res.render("artist-search-results", { artistsArr })
        })
        .catch(err => console.log('Error while searching artists: ', err));
});


app.get("/albums/:artistId", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albumsArr = data.body.items;
            res.render("albums", { albumsArr })
        })
        .catch(err => console.log('Error while searching artists albums: ', err))
})


app.get("/tracks/:trackId", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            const tracksArr = data.body.items;
            res.render("tracks", { tracksArr })
        })
        .catch(err => console.log('Error while searching albums tracks: ', err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


