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

// Home Page
app.get("/", (req, res, next) => {
  res.render("homepage");
});

//  Artists search
app.get("/artist-search", (req, res, next) => {
  let artistName = req.query.name;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      // console.log("The received data from the API: ", data.body.artists);

      const artistsData = data.body.artists.items.map((element) => {
        // console.log("element.name", element.name);
        return {
          name: element.name,
          image: element.images[1],
          id: element.id,
        };
      });

      res.render("artist-search-results", {
        artistsData,
        artistName,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Artists Album

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      // console.log("data.body.items", data.body.items)
      const albums = data.body.items.map((album) => {
        // console.log(album.name)
        return {
          albumId: album.id,
          albumName: album.name,
          albumImg: album.images[1],
        };
      });
      res.render("albums", { albums: albums });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:albumId/tracks", (req, res, next) => {
  let albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      // console.log("data.body.items ", data.body.items)
      const tracks = data.body.items.map((track) => {
        return {
          trackName: track.name,
          trackPreviewUrl: track.preview_url,
        };
      });
      res.render("tracks", { tracks: tracks });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3006, () =>
  console.log("My Spotify project running on port 3006 🎧 🥁 🎸 🔊")
);
