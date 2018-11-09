const express = require("express");
const app = express();
const hbs = require("hbs");
var SpotifyWebApi = require("spotify-web-api-node");
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");

//connecting to server and port
app.listen(3000, () => {
  console.log("We are ready to rumble");
});

// Remember to paste your credentials here
var clientId = "a83aba82e381466a86b20a917afcc170",
  clientSecret = "29750146fc1f4bb682bf683675ecea53";

var spotifyApi = new SpotifyWebApi({
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

//Index page
app.get("/", (request, response, next) => {
  response.render("index");
});

//Iteration 3 Step 2
// show all the artist from search form
app.get("/artists", (request, response, next) => {
  spotifyApi.searchArtists(request.query.artists)
    .then(data => {
      //response.send(data);
      //console.log(data.body.artists.items[0].id);
      let artist = data.body.artists.items;
      response.render("artists", { artist });
    })
    .catch(err => {
      console.log("Artists ERROR!!");
    });
});

//Iteration 4
//view albums from search result
app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      let album = data.body.items;
      // res.send(album);
      res.render("albums", { album });
    })
    .catch(err => {
      console.log("View Albums Error", err);
    });
});

//Iteration 5
//view album tracks from view albums
app.get("/tracks/:albumId", (req,res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
      let track = data.body.items;
    //   res.send(track);
    res.render("tracks", {track});
  })
  .catch(err => {
    console.log("View tracks Error", err);
  });
});