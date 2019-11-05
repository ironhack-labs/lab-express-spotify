require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
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
  res.render("index");
});

app.get("/artists", (req, res) => {
  
  spotifyApi

    .searchArtists(req.query.artist)

    .then(data => {
      // res.send(req.query)
      // console.log(data.body.artists.items);
      res.render("artists", data.body.artists);
    })

    .catch(err => {
      // console.log(data.body);
      console.log("The error while searching artists occurred: ", err);
    });
});



app.get("/albums/:artistId", (req, res) => {
  
  spotifyApi

    .getArtistAlbums(req.params.artistId)

    .then(data => {
      // res.send(req.query)
      // console.log(data.body);
      res.render("albums", data.body);
    })

    .catch(err => {
      // console.log(data.body);
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get("/tracks/:trackId", (req, res) => {

  spotifyApi

  .getAlbumTracks(req.params.trackId)

  .then(data => {
  //  return res.send(data);
  res.render("tracks", data.body);
  })

  .catch(err => {
    console.log("The error while searching all the tracks has occurred: ", err)
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
