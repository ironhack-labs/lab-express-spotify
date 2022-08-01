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
    res.render("homepage");
  });
  
  app.get("/artist-search", (req, res) => {
    const { search } = req.query; 
    spotifyApi
      .searchArtists(search/* artist */).then((data) => {
        const artists = data.body.artists.items; 
        console.log(artists);
        res.render("artist-search-results", { artists })})
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
    console.log("artist-search");
  });

  app.get("/albums/:albumId", (req, res) => {
    const { albumId } = req.params; 
    spotifyApi
      .getArtistAlbums(albumId) 
      .then((data) => {
        const albums = data.body.items; 
        res.render("albums", { albums }); 
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });
  
  app.get("/view-tracks/:trackId", (req, res) => {
    const { trackId } = req.params; 
    spotifyApi
      .getAlbumTracks(trackId) 
      .then((data) => {
        const tracks = data.body.items; 
        res.render("view-tracks", { tracks }); 
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
