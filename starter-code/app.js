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

//Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/", (req, res, next) => {
    res.render("index")
});

app.get("/artist-search", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {console.log("The received data from the API:", data.body.artists.items);
// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        const artistArray = data.body.artists.items;
        console.log(artistArray);
        
        res.render("artist-search-results", {artistArray})
       
        
        })
        .catch(err => console.log('The error while searching artist occured:', err));
});

app.get('/artist-search-results', (req, res, next) => {
    res.render("artist-search-results");
})

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = (req.params.artistId);
    spotifyApi.getArtistAlbums(artistId)
        .then(function(data) {
          //console.log("Artist albums", data.body.items);
          const albums = data.body.items;
          res.render("albums", { albums });
        })
        .catch(err => console.log(err));
        
});
// ALBUM ID
app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    console.log("Albums Tracks", data.body.items);
    const tracks = data.body.items;
    res.render("tracks", { tracks });
  })
    .catch(err => console.log(err));
});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
