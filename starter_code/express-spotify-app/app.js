const SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require('body-parser');
const app = express();
// Remember to paste here your credentials
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const clientId = '42c49a32986340e5822051012530d7dd',
    clientSecret = '356d5deea71d4f8d8902bb9f96a117ea';

const spotifyApi = new SpotifyWebApi({
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

app.listen(3000, function(err) {
    if (err) console.log(err);
    console.log("tu servidor esta funcionando en el puerto 3000");
});