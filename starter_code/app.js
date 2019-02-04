const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = "269be22573764fcea1917321147c5688",
  clientSecret = "b2842f89c08444fa8011dba906725f3e";

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

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist", (req, res, next) => {
  const {userInput} = req.query;
  spotifyApi
    .searchArtists(userInput)
    .then(data => {
      // res.json(data);
      console.log("The received data from the API: ", data.body);
      res.locals.musicData = data.body.artists.items;

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      //res.json(data.body.items);
      res.locals.albums = data.body.items;
      console.log("Artist albums", data.body);
      res.render("albums")
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/tracks/:id",(req,res,next) => {
  const {id} = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      // res.json(data.body.items);
      res.locals.tracks = data.body.items;
      res.locals.duration = (data.body.items.duration_ms / 1000);
      console.log("Artist albums", data.body);
      res.render("tracks")
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
})

app.listen(5555, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
