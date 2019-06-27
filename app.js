require("dotenv").config;
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const spotifyAPP = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const clientId = "d93427a0ef7e4040b1fa605f465793c5";
const clientSecret = "b9087137ad4e435ab6d7d8c181d201c5";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// the routes go here:

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/home", (req, res) => {
  res.send(req.body);
});

spotifyApi
  .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

