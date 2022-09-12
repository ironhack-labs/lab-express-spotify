require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

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
  res.render("search");
});

app.get("/artist-search", async (req, res) => {
  const Sresponse = await spotifyApi
    .searchArtists(req.query.name)
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  const atistsItems = Sresponse.body.artists.items;
  // console.log("The received data from the API: ", Sresponse.body);

  // for (let item of atistsItems) {
  //   console.log(item);
  // }

  const data = { doctitle: "Artists", artists: atistsItems };

  res.render("artist-search-results", data);
});

app.get("/albums/:artistId", async (req, res) => {

  const artistResponse = await spotifyApi.getArtist(req.params.artistId)
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );

  const Sresponse = await spotifyApi
    .getArtistAlbums(req.params.artistId)
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  const albumsItems = Sresponse.body.items;
  //console.log("The received data from the API: ", Sresponse.body);

  //  for (let item of albumsItems) {
  //    console.log(item);
  //  }

  const data = { doctitle: artistResponse.body.name + " Albums", albums: albumsItems };
  res.render("albums",data);
});

app.get("/tracks/:albumId", async (req, res) => {
  /* HOW TO SEND SOMETHING ELSE */
  const Sresponse = await spotifyApi
    .getAlbumTracks(req.params.albumId)
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  const tracksItems = Sresponse.body.items;
  for (let item of tracksItems) {
    console.log(item);
  }
  const data = { doctitle: "Tracks", tracks: tracksItems };
  res.render("tracks",data);
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
