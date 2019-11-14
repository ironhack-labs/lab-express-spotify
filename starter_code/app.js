require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/artists", (req, res) => {    
    let name = req.body.artist;
  spotifyApi
    .searchArtists(name)
    .then(data => {
        let searchArtists = data.body.artists.items;
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artists", {searchArtists});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});


app.get("/albums/:artistId", (req, res, next) => { 
    let name = req.params.artistId; 
    spotifyApi.getArtistAlbums(name)
    .then(data => {
        let albumsArtist = data.body.items;

      console.log('Artist albums', data.body.items);
      res.render("albums", {albumsArtist});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});


app.get("/tracks/:albumId", (req, res, next) => { 
    let name = req.params.albumId; 

    spotifyApi.getAlbumTracks(name)
    .then(data => {
        let songArtist = data.body.items;
        console.log(songArtist)
      res.render("tracks", {songArtist});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});




app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
