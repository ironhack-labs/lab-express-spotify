require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
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
    spotifyApi.setAccessToken(data.body["access_token"])
  console.log(data.body["access_token"])})
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => res.render("index"));

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then((data) => {
      console.log(
        "The received data from the API: " + data.body.artists.items[0].name
      );
      res.render("artist-search", data.body.artists);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(result => {
    console.log(result.body)
    res.render("albums",result.body)
  })
  .catch( err => console.log("This is an ALBUM error" + err))

});

app.get("/tracks/:albumId", (req,res) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(result => {
    console.log(result.body)
    res.render("tracks",result.body)
  })
  .catch( err => console.log("This is a TRACK error" + err))

})


app.listen(3500,() =>
  console.log("My Spotify project running on port 3500 🎧 🥁 🎸 🔊")
);
