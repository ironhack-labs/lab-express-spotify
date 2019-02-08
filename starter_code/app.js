const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views","./views");
hbs.registerPartials('./views/partials')
app.use(express.static(__dirname + "/public"));


// Remember to insert your credentials here
const clientId = "8800457b3a8b4c0d805de66d5022b414",
  clientSecret = "c200dd81280340c6a3ab209b46bb7209";


const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));




// the routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query.artistS)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items[0]);
      let arts = data.body.artists.items
      res.render("artists", {arts});
    })
    .catch(err => console.log("The error while searching artists occurred: ", err))
});

app.listen(3000, () =>
  console.log(`My Spotify project running on port 3000 🎧 🥁 🎸 🔊`)
);
