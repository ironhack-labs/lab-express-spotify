//Using Es6

//Packages
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

//Views config
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

let clientId = '04f3b20f3d064bfea97e62570d43938b';
let clientSecret = 'c24c2e09731543ed886bcfb385dcffa6';

 let spotifyApi = new SpotifyWebApi({
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

// Specify everything
app.set("views", path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set("view engine", 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

// View for home route
app.get('/', (req, res) => {
  res.render('index');
});

//Artists route
app.post("/artists", (req, res) => {
  let artist = req.body.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render("artists", {
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log("There was an error returning artist", err);
    });
});

//Get albums
app.get("/albums/:artistId", (req, res) => {
  let id = req.params;
  let lol = id.artistId;

  spotifyApi
    .getArtistAlbums(lol, {
      limit: 40,
      offset: 1
    })
    .then(data => {
      res.render("albums", {
        albums: data.body.items
      });

    })
    .catch(err => {
      console.log("An error has ocurred", err);
    });
});

// //Get album tracks
// // Get tracks in an album
app.get("/tracks/:trackId", (req, res) => {
  let track = req.params;
  let trackId = track.trackId;


  //Api call
  // Get tracks in an album
  spotifyApi
    .getAlbumTracks(trackId, {
      limit: 30,
      offset: 0
    })
    .then(data => {
      res.render("tracks", {
        tracks: data.body.items
      });


    })
    .catch(err => {
      console.log("An error has ocurred", err);
    });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));