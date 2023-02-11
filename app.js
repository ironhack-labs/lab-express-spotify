require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + '/views/partials');

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
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search-results", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist_name)
    .then((data) => {
      console.log("The received data from the API: ", data);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render("artist-search-results", { items: data.body.artists.items });
      /* res.send(data); */
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      let artist = data.body.items;
      res.render("albums", { artist });
      /* res.send(data); */
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get tracks in an album
app.get("/view-tracks/:trackId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId) /* { limit: 5, offset: 1 } */
    .then((data) => {
        /* const tracks = data.body.items[0]; */
        const tracks = data.body.items;
        console.log(tracks)
        res.render('view-tracks', {tracks})
        /* res.send(tracks) */
      })
      .catch((err) => 
        console.log("Something went wrong!", err)     
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

/* app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist_name)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let {name} = req.params;
      console.log(name)

      res.render('artist-search-results');
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
}); */
