require("dotenv").config();

const express = require("express");
const hbs = require("hbs");


// require spotify-web-api-node package here:
const spotifyApi = require("./config/spoti.config");
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:



const routes = require('./routes/routes');
// Our routes go here:
app.use('/', routes)



app.listen(3001, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
