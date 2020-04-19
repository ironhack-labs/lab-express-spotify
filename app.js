require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    // console.log(data.body);
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

// app.get("/test/:id", (req, res) => {
//   res.send({ id: req.param("id"), id2: req.param("id2") });
// });

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.param("artist"))
    .then((data) => {
    //   console.log('The received data from the API: ', data.body);
    //   console.log(data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/albums/:artistId', (req, res) => {

    const artistId = req.param('artistId');

    spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => {
            // console.log('Artist albums: ', data.body);
            // console.log(data.body.items[0]);
            res.render('albums', {albums: data.body.items});
        })
        .catch(error => 
            console.log("The error while searching albums ocurred: ", error)
        );
 });

app.get('/tracks/:albumId', (req, res) => {

    const albumId = req.param('albumId');

    spotifyApi.getAlbumTracks(albumId)
        .then((data) => {
            console.log('tracks: ', data.body);
            res.render('tracks', {tracks: data.body.items});
        })
        .catch(error => 
            console.log('Something went wrong!', error)
        );
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
