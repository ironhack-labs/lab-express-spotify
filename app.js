require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req, res, next) => res.render("index.hbs"));

app.get("/artist-search-results", (req, res, next) => {
    const {artistName} = req.query;

    spotifyApi
    .searchArtists(artistName)
    .then((data) => {
        console.log('Search artists by "XXX"', data.body.artists.items[0].images)
        res.render("artist-search-results.hbs", {artist: data.body.artists.items});
    })
    .catch((err) => console.log('There was an error', err))
});

app.get("/albums/:artistId", (req, res, nex) => {
    const {artistId} = req.params;

    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
        console.log('searching for albums from artist', data.body.items );
        res.render("albums.hbs", {albums: data.body.items} )
    } )
})


app.get("/tracks/:id", (req, res, nex) => {
    const {id} = req.params;

    spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
        console.log('here are audio previews', data.body.items)
        res.render('tracks.hbs', {tracks: data.body.items})
    })
    .catch((err) => console.log("Something went wrong", err))
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
