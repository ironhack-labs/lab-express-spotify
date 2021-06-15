require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

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

app.get("/", (req, res, next) => {
  res.render("home", {});
});

app.get("/artist-search", (req, res, next) => {
  const { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      const artists = data.body.artists.items;
      const artistsImage = [];

      // artists.forEach((artist) => {
      //   for (let i = 0; i < artist.images.length; i++) {
      //     console.log(artist.images[i].url);
      //     artistsImage.push(artist.images[i].url)
      //   }
      // });

      res.render("artist-search-results", { artists, artistsImage });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  console.log(req.params)
  const { artistId } = req.params.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("albums",{})
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
