const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

app.set("layout", "layouts");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static("public"));






// Remember to paste here your credentials
var clientId = '6413006c502e44f8a7e43387588b503c',
    clientSecret = '35fb9238538244efbdbf7b9fd2b31266';

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

//First rute
app.get('/', (req, res) => {
      res.render('index');
    });

app.get('/artist',(req,res) => {
    res.render('artist');
});

//Start server
app.listen(3000, () => {
    console.log("Listening port 3000!");
});