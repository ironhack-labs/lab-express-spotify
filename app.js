require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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


app.get('/', (req, res) => {
    res.render("home");
});

app.get('/artist-search', (req, res) => {
    res.render("artist-search-results");
    const artistName = req.query.artistName;
    res.send(`You searched for artist ${artistName}`);


    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            const artistsData = data.body.artists.items
            res.render("artist-search-result", { artists: artistsData })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


});


app.get("/albums/:artistId", (req, res, next) => {
    const artistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(artistId)
        .then(albumsFromDB => {
            const albums = albumsFromDB.body.items
            res.render("albums", { albums })
        })
        .catch(err => console.log("Error occured while searching albums: ", err))
})

app.get("/tracks/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const tracks = data.body.items
            res.render("tracks", { tracks })
        })
        .catch(err => console.log("Error occured while searching tracks: ", err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


