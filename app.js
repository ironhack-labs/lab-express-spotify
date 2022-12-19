require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

// setting the spotify-api goes here:

const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials/");

// Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  try {
    const searchArtistsResponse = await spotifyApi.searchArtists(
      req.query.name
    );

    const artistsData = searchArtistsResponse.body.artists.items;

    const path = "/albums/";

    const text = "albums";

    console.log("The returned artists data is: ", artistsData);

    res.render("artist-search-results", {
      artistsData,
      query: req.query.name,
      btnConfig: { path, text },
    });
  } catch (err) {
    console.log("Something went wrong while searching for artists: ", err);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const getArtistResponse = await spotifyApi.getArtist(req.params.artistId);

    const { name: artistName, id: artistId } = getArtistResponse.body;

    const albumsGetResponse = await spotifyApi.getArtistAlbums(artistId);

    const path = "/tracks/";

    const text = "tracks";

    const albumsData = albumsGetResponse.body.items;

    res.render("albums", {
      albumsData,
      artistName,
      btnConfig: { path, text },
    });
  } catch (err) {
    console.log("Something went wrong while getting artist albums: ", err);
  }
});

app.get("/tracks/:albumId", async (req, res) => {
  const getAlbumTracksResponse = await spotifyApi.getAlbumTracks(
    req.params.albumId
  );

  const tracksData = getAlbumTracksResponse.body.items;

  res.render("tracks", { tracksData });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
