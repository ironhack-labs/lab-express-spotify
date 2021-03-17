require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// first run npm install

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
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  const queryArtist = req.query.artist;
  // a console log of the searched for artist
  // console.log(queryArtist);
  spotifyApi
    .searchArtists(queryArtist)
    .then((data) => {
      // a console log of one artist (to see how its constructed)
      // console.log("Example of one artist: ", data.body.artists.items[0]);
      // a console log of all names
      // data.body.artists.items.forEach((i) => console.log(i.name));
      // a console log of all image urls
      // data.body.artists.items.forEach((i) => console.log(i.images[0].url));
      // console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
      // render is an express methos; takes two arguements; 1) name of the view. 2) an OBJECT which you construct. The object property is that which will get passed into handlebars. The second is the object value.
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:someArtistIdGoesHere", (req, res) => {
  const someArtistId = req.params.someArtistIdGoesHere;
  let someArtistName;
  spotifyApi
    .getArtist(someArtistId)
    .then((data) => {
      return (someArtistName = data.body.name);
    })
    .then((someArtistName) => {
      spotifyApi.getArtistAlbums(someArtistId).then((data) => {
        // console log of one albuum (to see how its constructed)
        // console.log("Here is the data", data.body.items[0]);
        res.render("albums", {
          albums: data.body.items,
          artistName: someArtistName,
        });
      });
    })
    .catch((err) =>
      console.log("The error while searching for artist album occured: ", err)
    );
});

app.get("/tracks/:someAlbumIdGoesHere", (req, res) => {
  const someAlbumId = req.params.someAlbumIdGoesHere;
  spotifyApi
    .getAlbumTracks(someAlbumId)
    .then((data) => {
      // console log of one albuum tracks (to see how its constructed)
      // console.log("Here is the data", data.body.items[0]);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching for album tracks occured: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
