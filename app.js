require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials")
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

app.get("/", (req, res, next) => {
    res.render("index")
})
app.get("/artist-search", async (req, res, next) => {
    // console.log("search query: ", req.query.search);
    const artistData = await spotifyApi.searchArtists(req.query.search)
    // console.log("API Body: ", artistData.body.artists.items);
    const data = artistData.body.artists.items
    // console.log(data);
    res.render("artist-search-results", {data})
})

app.get("/discography/:artist/:id", async (req, res, next) => {
    const {artist, id} = req.params
    // console.log(artist, id);
    let discographyData = await spotifyApi.getArtistAlbums(id)
    discographyData = discographyData.body.items
    console.log(discographyData);
    res.render("discography", {artist, discographyData})
})

app.get("/view-tracks/:album/:id", async (req, res, next) => {
    const {album, id} = req.params
    let albumData = await spotifyApi.getAlbumTracks(id)
    albumData = albumData.body.items
    console.log(albumData);
    res.render("view-tracks", {album, albumData})
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
