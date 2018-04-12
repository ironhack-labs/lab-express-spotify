const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

/* hbs.registerPartials(path.join(__dirname, "views", "partials")); */

const clientId = "3bf666e055684c42bc6eaa9789b34e37",
  clientSecret = "578bb2451be04f34aa57767599d67f86";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get('/', (req, res, next) => {
  res.render('home');
});

app.post('/artists', (req, res) => {
  let {artistName} = req.body;
  
  res.render('artists');
});

/* app.get("/artists", (req, res, next) => {
  res.render('artists');
});

app.get("/albums", (req, res, next) => {
  res.render('albums');
});

app.get("/tracks", (req, res, next) => {
  res.render('tracks');
});
 */

const port = 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
