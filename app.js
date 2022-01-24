require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

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
app.get("/", (req, res) => {
  res.render("home");
});

// ruta artis
app.get("/artist-search", (req, res) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      //console.log(data.body.artists.items);
      
      console.log(data.body.artists.items[0])

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artistSearchResults", {albums: data.body.artists.items});

    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// 404 error
app.use((req, res) => {
  res.status(404).send("Not found bro!");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
