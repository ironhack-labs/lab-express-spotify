require("dotenv").config();
const clientId = process.env.API_CLIENT,
    clientSecret = process.env.API_SECRET;

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");


const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.get('/', (req, res, next) => {
    res.render("index");
})
app.get('/albums/:id', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(data => {
    res.render("albums",{albums:data.body.items})
  // console.log("The received data from the API: ", data.body.items);
})
});

app.get('/tracks/:id', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then(data => {
    res.render("tracks",{tracks:data.body.items})
  console.log("The received data from the API: ", data.body);
})
});

app.post("/artists", (req, res) => {
    spotifyApi.searchArtists(req.body.name)
    .then(data => {
        res.render("artists",{artist:data.body.artists.items})
      // console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
    
});

spotifyApi
.clientCredentialsGrant()
.then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
})
.catch(error => {
  console.log("Something went wrong when retrieving an access token", error);
});







app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
