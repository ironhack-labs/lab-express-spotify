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

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items);
            const itemData = data.body.artists.items
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", { itemData })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get("/albums/:artist_id", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artist_id)
        .then(albumsData => {
            // console.log(albumsData.body.items[0].images[0].url);

            const albumItem = albumsData.body.items
            res.render("albums", { albumItem })
        })

})

app.get("/tracks/:album_id", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.album_id, { limit: 5, offset: 1 })
        .then(tracksData => {
            
            console.log(tracksData.body.name);
            const track = tracksData.body.items
            
            res.render("tracks", {track})
        })

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
