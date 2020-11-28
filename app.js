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
//IT1
app.get("/", (req, res) => {
    console.log("page index")
    res.render('index');
});
//IT2
app.get("/artist-search", (req, res) => {
    //res.send(req.query)
    //res.render('artist-search-results')
    //console.log(req.query.search)
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            let artist = data.body.artists.items 
            console.log("ARTIST", artist )
            //console.log('The received data from the API: ', data.body.artists.items);
            res.render("artist-search-results", {artist: artist})
            //artist.forEach(img => console.log(img.images))
        })
        .catch(err => console.log('The error while searching artists ocurred: ', err))
})

app.get("/albums/:artistId", (req, res) => {
    console.log("accediendo a albums", req.params.artistId)
    //res.render('albums')
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albumInfo = data.body.items
            console.log('Artist albums', data.body)
            res.render("albums", {albumInfo})
            albumInfo.forEach(album => console.log("FOREACH",album.artists))
        })
})

app.get("/albums/:albumId/tracks", (req, res) => {
    console.log("accediendo a tracks", req.params.albumId)
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            const trackInfo = data.body.items
            res.render('tracks', {trackInfo})
        })

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
