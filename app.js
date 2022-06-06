require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  //console.log("en el req",req.query.artist)

  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //console.log('The received data from the API: ', data.body.artists.items);
      let dataBodyArtistsItems = data.body.artists.items;
      res.render("artist-search-results", { dataBodyArtistsItems });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(
    function (data) {
     
      let dataBodyItems = data.body.items
      res.render("albums", { dataBodyItems });
    },
    function (err) {
      console.error(err);
    }
  )
  .catch((err) =>
  console.log("The error while searching albums occurred: ", err)
);
});


 app.get("/tracks/:songId", (req, res, next) => {
spotifyApi.getAlbumTracks(req.params.songId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body.items);
    let songs = data.body.items
    res.render("tracks", { songs });
    


  }, function(err) {
    console.log('Something went wrong!', err);
  })
  .catch((err) =>
  console.log("The error while searching songs occurred: ", err)
)
}) 





app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
