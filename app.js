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
  // redirectUri: 'http://www.example.com/callback'
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    // console.log("API token did run");
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  console.log("req query is: ", req.query);

  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      // console.log("Data body items: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE data FROM THE API'
      // console.log("First artists result:", data.body.artists.items[0]);
      // console.log("image object: ", data.body.artists.items[0].images)
      res.render("artist-search-results", {
        // SpotifyResponse: data.body,
        artists: data.body.artists.items,
      });
    })
    .catch(
      (err) => console.log("The error while searching artists occurred: ", err)
      // res.render("error")?
    );
});

app.get("/albums/:artistID", (req, res) => {
  // console.log("req params: ", req.params);
  // console.log("req query: ", req.query);
  // console.log("the real artistID: ", req.params.artistID);
  // console.log("the real artistID3: ", req.params.artistID.slice(3));

  spotifyApi.getArtistAlbums(req.params.artistID).then(
    (data) => {
      console.log("Artist albums :", data.body);
      console.log("First result album :", data.body.items[0]);
      // console.log("albumName :", data.body.items[0].name);
      // console.log("albumArtists :", data.body.items[0].artists);
      // console.log("albumImages :", data.body.items[0].images);
      console.log("bandName :", data.body.items[0].artists[0].name);

      res.render("albums", {
        albumArtistName: data.body.items[0].artists[0].name,
        albums: data.body.items,
      });
    },
    function (err) {
      console.error("Something went crack pow zas", err);
    }
  );
});

app.get("/tracks/:albumId", (req, res) => {
  console.log("req params: ", req.params);
  // console.log("req query: ", req.query);

  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 10, offset: 0 }).then(
    (data) => {
      console.log("tracks informsss : ", data.body);
      // console.log("artists array : ", data.body.items[0].artists);

      res.render("tracks", {
        tracksArtistName: data.body.items[0].artists[0].name,
        tracks: data.body.items,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
