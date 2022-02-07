require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials")

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
app.get("/", function (req, res) {
  res.send("hello");
});

app.get("/home", function (req, res) {
  res.render("home");
});

app.get("/artist-search", function (req, res) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render("artist-search-results", {artists: data.body.artists.items});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  console.log(req.query);
  
});

app.get("/albums/:artistId", function(req,res) {
     
    spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
     res.render('albums', {albums: data.body.items}) ;
  }
)});

app.get("/tracks/:album", function(req, res){
    spotifyApi.getAlbumTracks(req.params.album)
    .then(function(data){
        res.render("tracks", {tracks: data.body.items})
    })
})


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
