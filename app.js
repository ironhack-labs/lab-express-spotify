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

//Route for homepage
app.get("/", (req, res, next) => {
    const data = {
        className: "home"
    };
    res.render("home", data);
});

app.get("/artist-search", (req, res, next) => {
    let searchArtist = req.query.searchArtist;
    spotifyApi.searchArtists(searchArtist)
        .then(searchArtistResult => {
            const data = {
                className: "artist-search",
                artistsArray: searchArtistResult.body.artists.items
            };
            //console.log('The received data from the API: ', data.artistsArray[0]);
            res.render("artist-search-results", data);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
        .then(searchAlbums => {
            const data = {
                className: "albums",
                albumsArray: searchAlbums.body.items
            };
            //console.log('The received data from the API: ', searchAlbums.body.items[0]);
            res.render("albums", data);
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));


});

app.get('/track-list/:albumName/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    const albumName = req.params.albumName;
    spotifyApi.getAlbumTracks(albumId, { market: "US" })
        .then(searchTracks => {
            const data = {
                className: "track-list",
                albumName: albumName,
                tracksArray: searchTracks.body.items
            };
            //console.log('The received data from the API: ', searchTracks.body.items[0]);
            res.render("track-list", data);
        })
        .catch(err => console.log('The error while searching Tracks occurred: ', err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
