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
  spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get("/", (req, res, next) => {
    res.render("home");
});

app.get("/artist-search-results", (req, res, next) => {
    const artistName = req.query.artistName;

        spotifyApi.searchArtists(artistName)
            .then((data) => {
                console.log("The received data from the API:", data.body);
                res.render("artist-search-results", { artists: data.body.artists.items });
                
            })
            .catch((err) => {
                console.error("The error while searching artists occurred", err);
            });
});

app.get("/albums/:artistId", (req, res, next) => {

    console.log(req, res);
    const artist = req.params.artistId;

    spotifyApi.getArtistAlbums(artist, { limit: 10, offset: 20 })
    .then((data) => {
        res.render("albums", {albums: data.body.items});
    })
    .catch ((e) => {
        console.error("The error while searching artists occurred", e);
    })
})

app.get("/track/:albumId", (req, res, next) => {
    const album = req.params.albumId;
    spotifyApi.getAlbumTracks(album, { limit : 10, offset : 1 })
    .then((data) => {
      console.log(data.body.items);
      res.render("track", {tracks: data.body.items});
    })
    .catch ((e) => {
        console.error("The error while searching artists occurred", e);
    })

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
