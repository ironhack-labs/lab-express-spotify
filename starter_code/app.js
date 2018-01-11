var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '32b37c52347645008746a05864ad8c48',
  clientSecret = 'b5ad69b5d478449c9afcececf99fc248';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
/* require modules */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

/* Middlewares config */
app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* Routes */

app.get("/", (req, res) => {
  res.send("Hola");
});

app.get("/hello", (req, res) => {
  let number = Math.random();

  res.render("hello", {
    randomNumber: number
  });
});

app.get("/bye", (req, res) => {
  let someValues = ["A", "B", "C"];

  res.render("bye", {
    values: someValues
  });
});

app.listen(3000, () => console.log("Ready!"));