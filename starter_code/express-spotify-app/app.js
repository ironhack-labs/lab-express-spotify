var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'c52e697588554b10afbc716fe1c6b78d',
    clientSecret = 'b9b1079ec278445fa6d0f9bb3e8db903';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

const express = require('express');
const app = express();
const hbs = require('hbs');

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.listen(3000, () => console.log("READY"));

// ROUTES
app.get("/", (req, res, next) => {
    res.render("home-page.hbs");
});

app.get("/artists", (req, res, next) => {
    const artistToSearch = req.query.search_query;

    spotifyApi.searchArtists(artistToSearch)
    .then(result => {
        const artists = result.body.artists.items;
        res.locals.artists = artists;
        res.render("artist-results.hbs");
    })
    .catch(err => console.log("Artist fetch error", err));
});

app.get("/albums/:artistId", (req, res, next) => {
    const artistId = req.params.artistId;
    
    let albumPromise = spotifyApi.getArtistAlbums(artistId)
    .then(result => res.locals.albums = result.body.items)
    .catch(err => console.log("Album fetch error", err));

    let artistPromise = spotifyApi.getArtist(artistId)
    .then(result => res.locals.artist = result.body)
    .catch(err => console.log("Artist fetch error", err));

    Promise.all([albumPromise, artistPromise])
    .then(() => res.render("artist-albums.hbs"))
    .catch(err => console.log("Something went wrong", err));
});

app.get("/tracks/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
    
    spotifyApi.getAlbumTracks(albumId)
    .then(result => {
        res.locals.tracks = result.body.items;
        res.render("tracks.hbs")
    })
    .catch(err => console.log("Tracks fetch error", err))
})
