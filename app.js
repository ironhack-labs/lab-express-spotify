const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const express = require("express");

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

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
// home page

app.get("/", (req, res, next) => {
  console.log("Welcome to the homepage");
  res.render("home-page");
});

//artist-search-results

app.get("/artist-search-results", (req, res, next) => {
  console.log(req.query.newArtist);

  let newestArtist = req.query.newArtist; //query artist search

  spotifyApi
    .searchArtists(newestArtist) //we use teh spotifyApi method search artist adn pass it my newestArtist query
    .then((data) => {
      //we receive the array with objects
      console.log("The received data from the API: ", data.body.artists.items); //we see the array in the console and start navigating until getting the LPs
      res.render("artist-search-results", data.body.artists.items);

      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//albums
////////////////////////////////////////////////////
app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params);
  res.send(`info about albums.... ${req.params.artistId}`);

  spotifyApi.getArtistAlbums({ id: req.params.artistId }).then(
    (data) => {
      console.log("Artist albums", data.body.artists.items.albums);
      res.render("albums", data.body.artists.items.albums);
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3700, () =>
  console.log("My Spotify project running on port 3700 🎧 🥁 🎸 🔊")
);
