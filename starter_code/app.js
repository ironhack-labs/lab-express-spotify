const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
// setting the spotify-api goes here:

const clientId = "6fd0018a2cf94b498602b01c0cfca50a",
  clientSecret = "475045ca18a14e61ada95034938aa596";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.groupName)
    .then(data => {
      artist = data.body.artists.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", { artist });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      album = data.body.items;
      // // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", { album });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  // console.log(req.params);
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log(data.body.items);
      let tracks = data.body.items;
      // // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("tracks", { tracks });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  // console.log(req.params);
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
