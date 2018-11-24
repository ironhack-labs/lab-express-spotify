var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');


//Static files
app.use(express.static("public"))

app.set("views", __dirname + "/views")
app.set("view engine", "hbs")

const spotifyRoutes = require("./routes/routes")
app.use("/", spotifyRoutes)

// Remember to paste your credentials here
var clientId = '52c614e7c8ff445c904327cb2e0983fa',
    clientSecret = '60a0c85acd824539bd7db7ca3d6cda4c';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//app.get("/",(req, res) => {
//  res.send("Ironhack Spotify")
//})







app.listen(3000, () => {
  console.log("Es 3000 !")
})