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
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search/", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //   console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //   console.log(data.body.artists.items[0].images[1].url);
      const filteredArtistsArr = data.body.artists.items.filter((elm) => {
        return req.query.artist ? elm.name.toLowerCase().includes(req.query.artist.toLowerCase()) : true;
      });
      //   console.log("FILTERED", filteredArtistsArr[0]);
      //   console.log("FILTERED", filteredArtistsArr[0].images[2].url);

      res.render("artist-search-results", { filteredArtistsArr });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albumData = {
        albumsArray: data.body.items,
        artist: data.body.items[0].artists[0].name,
        artistId: data.body.items[0].artists[0].id,
      };
      console.log("ALBUMS ARRAY", albumData.albumsArray[0].id);
      res.render("albums", albumData);
    })
    .catch((err) => console.log("error occured while searching for albums", err));
});

app.get("/albums/:artistId/:albumId", (req, res, next) => {
  console.log("REQ", req.params);
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      const tracksData = {
        tracksArray: data.body.items,
      };
      console.log("ONE ALBUM", data.body.items);
      res.render("tracks", tracksData);
    })
    .catch((err) => console.log("error looking for specific album", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
