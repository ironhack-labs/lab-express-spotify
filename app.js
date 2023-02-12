require("dotenv").config();

const { json } = require("express");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const port = 3000;
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

// home
app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res, next) => {
  const artist = req.query.artist;
  console.log(artist);
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API for the search: ", data.body);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let artistData = data.body.artists.items;
      console.log(artistData[0]);
      res.render("artist-search-results.hbs", { artistData });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      let albums = data.body.items;
      res.render("albums.hbs", { albums });
	  console.log(albums)
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumId/", (req, res, next) => {
	let albumId = req.params.albumId;
	console.log("this is the albumid", albumId)
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
        console.log("tracks view test", data.body.items);
		let tracks = data.body.items
		res.render("tracks.hbs", { tracks });
      }).catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
// 404 page
app.get("*", (req, res, next) => {
  res.send(
    "404 error - Whatever it is that you are looking for... it ain't here."
  );
});

app.listen(port, () =>
  console.log(`My Spotify project 🏃 on port ${port} 🎧 🥁 🎸 🔊`)
);
