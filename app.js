require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const connectingDB = require("./config/db");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
///*/*/*/*/*
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    // console.log(data);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

///*/*/*/*/*/*
app.use(express.urlencoded({ extended: true }));

// Our routes go here:
app.use("/", require("./routers/index"));

app.listen(process.env.PORT, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

module.exports = spotifyApi;
