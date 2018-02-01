const express = require("express");
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');
const expressLayouts = require('express-ejs-layouts');

// Remember to paste here your credentials
var clientId = 'd0d3701dd96843519a36d80bfd829018',
    clientSecret = '78c49766eab14f7fb77f42a2d6404f7d';

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

app.set("views", __dirname + "/view");
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
    // res.render(index, "hello world");
    res.render("index");
});

app.listen(3000);