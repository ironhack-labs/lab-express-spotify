var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("images", "images/home-heading");
app.set("views", __dirname + "/views");

// Remember to paste here your credentials
var clientId = "",
  clientSecret = "";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Access granted to the Spotify API");
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

//Retreive main page
app.get("/", (req, res, next) => {
  console.log("Got a request for the index");
  res.render("index", {});
});

//Retreive the artist from input form
app.get("/artists", (req, res, next) => {
  let artistQuery = req.query.artist;

  spotifyApi
    .searchArtists(artistQuery)
    .then(artists => {
      //Only for displaying in console
      let artistsArray = [];
      artists.body.artists.items.forEach(artist =>
        artistsArray.push(artist.name)
      );
      let imagesURLArray = [];
      artists.body.artists.items.forEach(artist =>
        imagesURLArray.push(artist.images[1].url)
      );
      console.log(artistsArray);
      //End of display in console
      res.render("artists", { artists: artists });
    })
    .catch(err => {
      throw err;
    });
});

app.listen(3000, () => {
  console.log("I am ready!");
});
