const express = require("express");
const hbs = require("hbs");
const path = require("path"); 
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser"); //HERE------
// require spotify-web-api-node package here:
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true })); //HERE.---------

// Remember to insert your credentials here
const clientId = "539221b5b8ee48aa873c80d3dd391490",
  clientSecret = "47954c37b9c0452382b3e780c8018ce4";

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
//Homepage
app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

// Artist Search
app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      res.render("artists", { items: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});



// Artist Albums
app.get("/albums/:ID", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.ID).then(data => {
    res.render("albums", { items: data.body.items });
  });
});

//Artist Tracks
app.get("/tracks/:ID", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.ID).then(data => {
    res.render("tracks", { items: data.body.items });
  });
});



//Port Listener
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
