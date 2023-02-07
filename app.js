require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Handlebars helper
hbs.registerHelper('sliceDate', date => {
    return date.slice(0, 4);
});

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
    res.render("index");
})

app.get("/artist-search", (req, res) => {
    const artistName = req.query.artist;
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            res.render("artist-search-results", { artists: data.body.artists.items, query: artistName });
            console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res, next) => {
    const artistId = req.params.id;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            res.render("albums", { albums: data.body.items })
            // console.log(data.body.items[3]);
        })
        .catch(err => console.log('The error while searching albums occured: ', err))
})

app.get("/tracks/:id", (req, res, next) => {
    const albumId = req.params.id;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            res.render("tracks", { tracks: data.body.items })
            console.log(data.body.items[0]);
        })
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
