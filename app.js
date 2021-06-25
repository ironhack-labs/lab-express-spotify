require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebAPI = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

//Connect To API
spotifyWebApi
  .clientCredentialsGrant()
  .then(data => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/home", (req, res) =>{
    res.render("home");
});


app.get('/artist-search', async (req, res) => {
    const results = await spotifyWebApi.searchArtists(req.query.artists);
    const artistsResult = results.body.artists.items;
   res.render("artists-search-results", { artistsResult } );

});

app.get("/albums/:artistId", async (req, res) =>{       
    const albumResults = await spotifyWebApi.getArtistAlbums(req.params.artistId);
    const allAlbums = albumResults.body.items;
    res.render("albums", {allAlbums});

});

app.get("/tracks/:albumId", async (req, res) =>{       
    const albumTracks = await spotifyWebApi.getAlbumTracks(req.params.albumId);
    const allTracks = albumTracks.body.items;
    console.log("music", allTracks);
    res.render("tracks", {allTracks});

});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
