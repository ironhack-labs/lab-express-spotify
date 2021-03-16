const dotenv = require("dotenv").config();
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const express = require("express");
const hbs = require("hbs");
const app = express();
const path = require("path");
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(path.join(__dirname, "views/partials"));
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.searchName)
    .then((data) => {
      for (i = 0; i < data.body.artists.items.length; i++) {
        if (data.body.artists.items[i].images.length > 0) {
          console.log(
            "The received data from the API: ",
            data.body.artists.items[i]
          );
        }
      }
      res.render("artistsearchresults", {
        searchTerm: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      // console.log(data.body.items[0],data.body.items[1]);
      // for (i = 0; i < data.body.items.length; i++) {
        // console.log(data.body.items[i].name, data.body.items[i].images[0].url);
      // }
      res.render("albums",{ albumsdata : data.body.items });
      // res.send(data.body.items[0].images[0].url);
      })
    

    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumid", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.albumid)
    .then((data) => {
      // console.log(data.body.items[0], data.body.items[1]);
res.send(data)      // for (i = 0; i < data.body.items.length; i++) {
        // console.log(data.body.items[i].name, data.body.items[i].images[0].url);
      // }
      // res.render("albums",{ albumsdata : data.body.items });
      // res.send(data.body.items[0].images[0].url);
      })
    

    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
