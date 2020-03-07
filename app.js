require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerHelper("contains", (element, array, options, name, imagesUrl) => {
    // console.log('options.fn', options.fn(this));
    // console.log('inverse', options.inverse(this));
    console.log(name)
  return array.includes(element) ? options.fn(this) : options.inverse(this);
//return array.includes(element) ? true : false;
});

hbs.registerHelper("json", function(context) {
  return JSON.stringify(context);
});

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("form");
});

app.get("/artist-search", (req, res) => {
  const { query } = req.query;
  spotifyApi
    .searchArtists(query)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      //   res.send(data.body)
      res.render("artist-search-results", data.body);
    })
    .catch(err => {
      if (err.statusCode === 401) {
        spotifyApi;
      }
      console.log(`The error while searching artists occurred: ${err}`);
    });
});

app.get("/albums/:albumId", (req, res) => {
  const { albumId } = req.params;
  console.log(albumId)
  spotifyApi.getArtistAlbums(albumId).then(
    function(data) {
    //   res.send(data.body);
      res.render("albums-search-results", data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
