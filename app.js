require('dotenv').config();

// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:

app.get("/", (req, res, next) => {
    res.render("homepage")

})

app.get("/artist-search", (req, res, next) => {
    async function searchArtists(artistName) {
        try {
            let result = await spotifyApi.searchArtists(artistName);
            result = { artistList: result.body.artists.items };
            res.render("artist-search-result", result);
        }
        catch(error){console.error("Could not retrieve the list of artists")}
    }
    searchArtists(req.query.artist);
})

app.get("/albums/:artistId", (req,res,next) => {
    async function getAlbumsByArtistId(id) {
        let result= await spotifyApi.getArtistAlbums(id);
        result = {albumList: result.body.items};
        console.log(result);
        res.render("albums",result)
    }
    getAlbumsByArtistId(req.params.artistId);
})

app.get("/tracks/:albumId", (req,res,next) => {
    async function getTracksByAlbumId(id) {
        let result= await spotifyApi.getAlbumTracks(id);
        result = {albumTracks: result.body.items};
        console.log(result);
        res.render("tracks",result)
    }
    getTracksByAlbumId(req.params.albumId);
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
