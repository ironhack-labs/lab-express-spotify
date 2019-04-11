const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const prettyJson = require("prettyjson");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const clientId = "cd3c2166a5fa422aa2c51ba6d1405c4f",
  clientSecret = "d8a9ab6f6aa947cd84425a429e770eee";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.body.name)
    .then(data => {
      //console.log(`The received data from the API: ${req.query.artist}`);
      //res.json(data.body)
      let artists = data.body.artists.items;
      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => 
      {
        //res.json(data.body)
        let albums = data.body.items;
        res.render("albums", { albums });
      })
  
});

app.get("/tracks/:albumId", (req, res) => {
  
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => 
      {
        let tracks = data.body.items;
        //res.json(tracks)
        
        res.render("tracks", { tracks });
      })
  
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
