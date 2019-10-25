require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const port = 3000;
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

hbs.registerPartials(`${__dirname}/views/components`)
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// the routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistQuery)
    .then(data => {
      res.render("artists", data.body.artists.items);
      console.log(data.body.artists.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(data =>{
    res.render("albums", data.body.items)
    console.log(data.body.items[0])
  }).catch(err=>{
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get("/tracks/:albumsId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumsId).then(data =>{
    res.render("tracks", data.body.items)
    console.log(data.body.items[0])
  }).catch(err=>{
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(`${port}`, () =>
  console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`)
);
