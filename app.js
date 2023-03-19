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

// Route for the home page
app.get("/", (req, res) => {
  res.render("home");
});

//Route for the search result page
app.get("/artist-search-results", (req, res) => {
  const queryArtist = req.query.artist;

  spotifyApi
    .searchArtists(queryArtist)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((e) =>
      console.log("The error while searching artists occurred: ", e)
    );
});

//Rout for the albums page
app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items.map((item) => {
        return {
          name: item.name,
          image: item.images[0].url,
          id: item.id,
        };
      });

      res.render("albums", { albums });
    })
    .catch((e) =>
      console.log("An error while loading the Albums page occurred: ", e)
    );
});

// Route for album tracks page
app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId, { limit: 5, offset: 1 })
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { albumId, tracks });
    })
    .catch((e) => {
      console.log("Error occurred while getting album's tracks:", e);
    });
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
