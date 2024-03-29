require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

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
app.get("/home", (request, response, next) => response.render("index"));

app.get("/artist-search", (request, response, next) => {
  let artistDetails;
  console.log(request.query.query);
  spotifyApi
    .searchArtists(request.query.query)
    .then((data) => {
      let myArr = data.body.artists.items;
      let newArr = [];
      myArr.forEach((item) => {
        let myObj = {};
        myObj.name = item.name;
        myObj.image = item.images[0];
        myObj.id = item.id;
        newArr.push(myObj);
      });
      return newArr;
    })
    .then((artistDetails) => {
      console.log(artistDetails);
      return response.render("artist-search-results", { artistDetails });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      let myArr = data.body.items;
      let newArr = [];
      myArr.forEach((item) => {
        let myObj = {};
        myObj.name = item.name;
        myObj.image = item.images[0];
        myObj.id = item.id;
        newArr.push(myObj);
      });
      return newArr;
    })
    .then((albumDetails) => {
      console.log(albumDetails);
      return res.render("albums", { albumDetails });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
    .then((data) => {
      let myArr = data.body.items;
      let newArr = [];
      myArr.forEach((item) => {
        let myObj = {};
        myObj.name = item.name;
        myObj.preview_url = item.preview_url;
        newArr.push(myObj);
      });
      return newArr;
    })
    .then((trackDetails) => {
      console.log(trackDetails);
      return res.render("tracks", { trackDetails });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
