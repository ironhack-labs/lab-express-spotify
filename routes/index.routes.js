const express = require("express")
const SpotifyWebApi = require("spotify-web-api-node");

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get("/", (request, response) => {
    response.render("index");
})

router.get('/artist-search', (request, response) => {

    spotifyApi
        .searchArtists(request.query.searchTerm)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            response.render('artist-search-results', { results: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

router.get('/albums/:artistId', (request, response) => {

    spotifyApi
        .getArtistAlbums(request.params.artistId).then(
            function (data) {
                console.log('Artist albums', data.body);
                response.render("albums", { album: data.body.items })
            },
            function (err) {
                console.error(err);
            }
        );
});

router.get("/albums/tracks/:tracksId", (request, response) => {

    spotifyApi.getAlbumTracks(request.params.tracksId, { limit: 20, offset: 1 })
        .then(function (data) {
            console.log(data.body);
            response.render("tracks", { track: data.body.items })
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})

module.exports = router; 