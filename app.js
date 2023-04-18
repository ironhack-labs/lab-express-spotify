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

// Register partials to use them with handlebars
hbs.registerPartials(__dirname + "/views/partials");

// Our routes go here:

app.get("/", function (req, res) {
  console.log("Hello Spotify");
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const queryString = req.query.q;
  console.log(queryString);
  spotifyApi
    .searchArtists(queryString)
    .then((data) => {
      const artistList = data.body.artists.items;
      console.log(artistList);
      //   console.log(artistList[0].images);
      res.render("artist-search-results", { artistList, queryString });
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
      const albumList = data.body.items;
      const nameArtist = data.body.items[0].artists[0].name;
      res.render("albums", { albumList, nameArtist }); // Here you can give the data you new for your template
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

/* app.get("/tracks/:albumId", (req, res, next) => {
  const params2 = req.params.albumId;
  spotifyApi
    .getAlbumTracks(params2)
    .then((data) => {
      const trackList = data.body.items;
      const nameArtist = data.body.items[0].artists[0].name;
      return { trackList, nameArtist };
    })
    .then((templateData) => {
      return spotifyApi
        .getAlbum(params2)
        .then((data) => {
          console.log(data.body.name);
          return data.body.name;
        })
        .then((albumTitle) => {
          return { ...templateData, albumTitle };
        });
    })
    .then((templateData) => {
      res.render("tracks", templateData);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
}); */

app.get("/tracks/:albumId", async (req, res, next) => {
  const albumId = req.params.albumId;
  try {
    // here we get the tracks info
    const data = await spotifyApi.getAlbumTracks(albumId);
    const trackList = data.body.items;
    const nameArtist = data.body.items[0].artists[0].name;
    // here we get the album info
    const albumData = await spotifyApi.getAlbum(albumId);
    const albumTitle = albumData.body.name;
    // here we render the infos we need in the page we want to render
    res.render("tracks", { trackList, nameArtist, albumTitle });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
  }
});

// Listen
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
