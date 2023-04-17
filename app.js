require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const spotifyWebApi = require("spotify-web-api-node")

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get("/", function(req, res) {
    console.log("redirecting")
    res.render("index")
})

app.get("/artist-search", function(req, res) {
    const artist = req.query.q
    console.log(artist)
    spotifyApi
    .searchArtists(artist)
    .then(response => {
        //console.log("received API Data: ", response.body)
        //console.log(response.body.artists.items)
        //console.log(response.body.artists.items[0].images)
        /* console.log(response.body.artists.items[0].images[0].url) */
        artistArr = response.body.artists.items
        res.render("artist-search-result", { artistArr })
    })
    .catch(err => console.log("Error Artist: ", err))
    
})

app.get("/albums/:artistID", function(req, res) {
    const artistID = req.params.artistID
    console.log(artistID)
    
    spotifyApi
    .getArtistAlbums(artistID)
    .then(response => {
        console.log("test2")
        //console.log(response.body.items[0].images)
        albumsArr = response.body.items
        res.render("albums", { albumsArr })
    })
    .catch(err => console.log("Error Albums: ", err))
})

app.get("/tracks/:albumID", function(req, res) {
    const albumID = req.params.albumID
    console.log(albumID)

    spotifyApi
    .getAlbumTracks(albumID)
    .then(response => {
        console.log(response.body)
        tracksArr = response.body.items
        res.render("tracks", { tracksArr })
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
