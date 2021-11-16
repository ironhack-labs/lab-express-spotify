require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
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

// ROUTES
app.get("/", (req, res) => {
  res.render("home.hbs");
});

app.get("/artist-search-results", async (req, res) => {
  try {
    // const searchResults = await spotifyApi.searchArtists(req.params.search)

    const response = await spotifyApi.searchArtists(req.query.search)
    res.render("artist-search-results.hbs", { artists: response.body.artists.items });
 } catch (err) {
    res.render("error.hbs", {
      errorMsg: "An error while searching artists occurred: ",
    });
  }
});



app.get("/albums/:artistId", async (req, res) => {
  try {
    // console.log(req.params.artistId)

    const response = await spotifyApi.getArtistAlbums(req.params.artistId)
    res.render("albums.hbs", { albums : response.body.items });

  } catch (err) {
    res.render("error.hbs", {
      errorMsg: "An error while searching albums occurred: ",
    });
  }
});


app.get("/tracks/:albumId", async (req, res) => {
    try {
      const response = await spotifyApi.getAlbumTracks(req.params.albumId);
      res.render("tracks.hbs", { tracks: response.body.items });
    } catch (err) {
      console.log("The error while searching artists occurred: ", err);
    }
  });


app.listen(3100, () =>
  console.log("My Spotify project running on port 3100 🎧 🥁 🎸 🔊")
);