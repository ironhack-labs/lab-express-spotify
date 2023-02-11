//dunno what's this for, already came with the exercice
require("dotenv").config();


//requiring the express npm package and storing it on a variable called express
const express = require("express");
//requiring the hbs npm package and storing it on a variable called hbs
const hbs = require("hbs");


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
//we create a variable called app in which will be used for running express application
const app = express();


//we tell our Express app that HBS will be in charge of rendering the HTML
app.set("view engine", "hbs");
// creates an absolute path pointing to a folder called "views"
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
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

//----------------------------------START--------
// Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  let { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      let allinfo = data.body.artists.items;
      res.render("artist-search-results", { allinfo });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let id = req.params.artistId;

  spotifyApi.getArtistAlbums(id).then((data) => {
    /* console.log(data.body.items[0].images[0].url); */
    res.render("albums", {result: data.body.items});
  });
});

app.get("/tracks/:albumId", (req, res, next) => {
    let id = req.params.albumId;
  
    spotifyApi.getAlbumTracks(id).then((data) => {
      console.log(data.body); 
      res.render("tracks", {result: data.body.items});
    });
  });



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
