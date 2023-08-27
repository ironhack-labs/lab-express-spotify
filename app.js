require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
hbs.registerPartials(__dirname + "/views/partials"); //tell HBS which directory we use for partials

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api
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

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

//Home page
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const artistSearch = {
        listOfArtists: data.body.artists.items,
      };
      res.render("artist-search-results", artistSearch);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albumNames = {
        listOfAlbums: data.body.items,
      };
      res.render("albums", albumNames);
    })
    .catch((err) =>
      console.log("The error while looking for artist's album: ", err)
    );
});

app.get("/album/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = {
        listOfTtracks: data.body.items,
      };
      res.render("album-tracks", tracks);
    })

    .catch((err) =>
      console.log("The error while looking for artist's album: ", err)
    );
});
