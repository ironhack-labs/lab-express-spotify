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
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (request, response) => {
  response.render("index.hbs");
});

app.get("/artist-search", (request, response) => {
  const userInput = request.query.title;
  console.log(userInput);
  spotifyApi
    .searchArtists(userInput)
    .then(data => {
      //   response.send(data);
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render("artist-search-results.hbs", {
        data: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response) => {
  const albumID = request.params.artistId;
  spotifyApi
    .getArtistAlbums(albumID)
    .then(data => {
      //response.send(data);
      console.log("The received data from the API: ", data.body);
      response.render("albums.hbs", { data: data.body.items });
    })
    .catch(err =>
      console.log("The error while searching artits occurred: ", err)
    );
});

app.get("/tracks/:trackID", (request, response) => {
  const trackID = request.params.trackID;
  spotifyApi
    .getAlbumTracks(trackID)
    .then(data => {
      //response.send(data);
      console.log("The received data from the API: ", data.body);
      response.render("tracks.hbs", { data: data.body });
    })
    .catch(err =>
      console.log("The error while searching artits occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
