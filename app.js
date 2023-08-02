require("dotenv").config({ path: ".env" });

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
    console.log('I can see homepage');
  res.render("home-page");
});

app.get("/artist-search", (req, res, next) => {
    console.log('I can see artist page');
  let artistSearch = req.query.artist;

  spotifyApi
    .searchArtists(artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
        const artists = data.body.artists.items;
        if (artists.length > 0) {
          const artist = artists[0];
          const artistName = artist.name;
          res.render('artist-page', { artistName });
        } else {
          // Handle case when no artist is found
          res.render('artist-page', { artistName: 'Artist Not Found' });
        }
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {artistName} );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );

});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
