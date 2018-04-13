var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

// Remember to paste here your credentials
const clientId = "bfaa8e95acdf4ccead1ac026e01e9e54",
  clientSecret = "aea53b35f58a462f9c1fb5335e740417";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// ...
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/", (req, res) => {
  const data = {
    title: "Home"
  };
  res.render("index", data);
});
app.post("/artists", (req, res) => {
  let art = req.body.artist;
  console.log(art);
  //res.send(`Artits: ${art}`);
  spotifyApi
    .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/ art, { limit: 3 })
    .then(data => {
        
      data = data.body.artists;
      
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      console.log(`Busqueda por ${art}`, data.items[0].images[0].url);
      res.render("artits", data);
      //.items[0].images[0]
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.log(err);
    });
});
app.get("/albuns/:artistId", (req, res) => {
  let albun = req.params.artistId;
  spotifyApi
    .getArtistAlbums(albun, { limit: 25 })
    .then(data => {
      let albuns = data.body.items;
      console.log(albuns[0].images[0].url);
      res.render("albuns", {albuns});
    })
    .catch(err => {
      console.log(err);
    });
});
app.get("/track/:trackId", (req, res) => {
  let track = req.params.trackId;
  spotifyApi
    .getAlbumTracks(track, { limit: 3 })
    .then(data => {
      let track = data.body;
      console.log(track);
      res.render("track", track);
    })
    .catch(err => {
      console.log(err);
    });
});
app.listen(3000, () => console.log(`Listening`));
