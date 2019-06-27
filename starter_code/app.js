const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

require("dotenv").config();
// require spotify-web-api-node package here:
// Remember to insert your credentials here

const clientId = "e8a861e323e54c7e8c2aa736034c7697",
  clientSecret = "2e2810d94f284d0d8d2d27e6416d7717";
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token


const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
// setting the spotify-api goes here:

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
  res.render("index");
});



app.post("/artists",
  (req, res) => {
    spotifyApi.searchArtists(req.body.name)
    .then(data => {
        let artistName = data.body.artists.items
        // console.log(artistName)
        // console.log("The received data from the API: ", data.body);

      res.render("artists", {artistName: data.body.artists.items})





      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

  app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi.getArtistAlbums(req.params.artistId, function (err, data) {
        if(err) console.error(err);
        else console.log("Artist albums", data)
    }).then(data => {
        res.render("albums", {album: data.body.items})

    })
  });


  app.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi.getAlbumTracks(req.params.albumId, function (err, data) {
        if(err) console.error(err);
        else console.log("Album tracks", data)
    }).then(data => {
        res.render("tracks", {track: data.body.items})

    })
  });


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
