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
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("artist-search");
});

app.get("/artist-search", (req, res) => {
  console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      data.body.artists.items.map((e) => {
        // dealing with images array
        if (e.images.length > 0) {
          e.images = [e.images[1]];
        }
        // add text in case there is no image
        if (e.images.length === 0) {
          e.images = [];
          image = {};
          image.text = "No photo available";
          e.images.push(image);
        }
        return e.images;
      });
      res.render("artist-search-result", { content: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  console.log(req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // dealing with images array
      data.body.items.map((e) => {
        if (e.images.length > 0) {
          // get the first image from array
          e.images = [e.images[1]];
        }
        // add text in case there is no image
        if (e.images.length === 0) {
          e.images = [];
          image = {};
          image.text = "No photo available";
          e.images.push(image);
        }
        return e.images;
      });

      res.render("albums", { albumContent: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists Id occurred: ", err)
    );
});

app.get("/tracks/:artistId", (req, res) => {
  console.log(req.params.artistId);
  spotifyApi
    .getAlbumTracks(req.params.artistId, { limit: 5, offset: 1 })
    .then((data) => {
      console.log(data.body);
      res.render("tracks");
    })
    .catch((err) =>
      console.log("The error while searching artists Id occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
