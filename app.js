require("dotenv").config(); //para não ficar publico o numero do id e do secret

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

app.get("/", (req, res) => {
  console.log("Debora e michelle hackers demais!!!");
  res.render("home");
});

spotifyApi
  .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then((data) => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );

app.get("/ albums /: artistId", (req, res, next) => {
  // .getArtistAlbums () o código vai aqui
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
