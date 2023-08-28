require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// *********** SETTING UP THE SPOTIFY API ***********
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// *********** RETRIEVE AN ACCESS TOKEN ***********
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// *********** HOMEPAGE ***********
app.get("/", (req, res, next) => {
  res.render("homepage");
});

// *********** ARTIST SEARCH ***********
app.get("/artist-search", (req, res, next) => {
  const artistName = req.query.name;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      const artists = data.body.artists.items.map((artist) => {
        return {
          name: artist.name,
          imageArtist: artist.images[1],
          id: artist.id,
        };
      });
      res.render("artist-search-results", { artists, artistName });
    })
    .catch((err) => console.log("Can't find the artist", err));
});

// *********** ALBUM SEARCH ***********
app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items.map((album) => {
        return {
          name: album.name,
          imageAlbum: album.images[0].url,
          albumId: album.id,
        };
      });
      const artistName = data.body.items[0].artists[0].name;
      res.render("albums", { albums, artistName });
    })
    .catch((err) => console.log("Can't find the albums", err));
});

// *********** TRACK SEARCH ***********
app.get("/albums/:albumId/tracks", (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      const tracks = data.body.items.map((track) => {
        return {
          name: track.name,
          previewUrl: track.preview_url,
        };
      });
      console.log("NEW DATA: ", data.body)
      res.render("tracks", { tracks: tracks });
    },
    function (err) {
      console.log("Can't find the tracks of this album", err);
    }
  );
});

// *********** LISTENING ON PORT***********
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
