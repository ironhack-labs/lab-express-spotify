require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

// homepage route
app.get("/", (req, res, next) => {
  res.render("home");
});

// artist search route
app.post("/artist-search", (req, res, next) => {
  const nameArtist = req.body.artist;
  spotifyApi
    .searchArtists(nameArtist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images
      );
      res.render("artist-search-results", data.body);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// view albums route
app.get("/album/:albumId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then((data) => {
      res.render("albums", data.body);
    })
    .catch((err) =>
      console.log("An error while searching albums occurred: ", err)
    );
});

// view tracks route
app.get("/track/:id",(req,res,next)=>{
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data=>{
        console.log(data.body)
        res.render("tracks",data.body)
    })
    .catch((err) =>
      console.log("An error while searching for tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
