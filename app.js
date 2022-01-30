require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );


// Our routes go here:
//simple home page: first we render the index page
app.get('/', (req, res, next) => {
  res.render("index");
})
//then we send a request to the api to get the data on the form
app.get("/artist-search", (req, res, next) => {
    const {artist} = req.query;
  // Search artists whose name contains 'Love'
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const artistsFromApi = data.body.artists.items;
      res.render("artist-search-results", { artists: artistsFromApi});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//albums route
app.get("/albums/:artistId", (req, res, next) => {
    const {artistId} = req.params;
    // Search artists whose name contains 'Love'
    spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        const albumsFromApi = data.body.items;
        //console.log('albums from api', albumsFromApi);
        res.render("albums", {albums : albumsFromApi});
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      ); 
});

//tracks
app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;
  // Search artists whose name contains 'Love'
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracksFromApi = data.body.items;
      res.render("tracks", { tracks: tracksFromApi });
    })
    .then(() => {
      spotifyApi
        .getAlbum(albumId)
        .then((albumData) => {
        const albumName = albumData.body.name;
        res.render("tracks", { name : albumName });
    })
    }) 
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );  
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
