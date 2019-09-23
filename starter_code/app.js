require("dotenv").config();

const express = require("express");
const app = express();
//body parser
const bodyParser = require("body-parser");

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:s

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
  // console.log("que es", req.query);
  let { search } = req.query;
  // res.send("This is the artists page!");
  spotifyApi
    .searchArtists(search)
    .then(data => {
      // console.log("Este es el body", data);
      // console.log("The received data from the API: ", data.body.artists);
      let { items } = data.body.artists;
      items.search = search;
      items.forEach(item => {
        if (item.images.length !== 0) {
          item.images = item.images[1];
        } else {
          item.images = {
            url:
              "https://vinylboutique.co.uk/wp-content/uploads/2017/05/default-release-cd.png"
          };
        }
      });
      // res.send(items);
      // // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", { items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  let { artistId } = req.params;
  // res.send(artistId);
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      // console.log("Artist albums", data.body);
      let { items } = data.body;
      items.artistName = items[0].artists[0].name;
      // console.log(items.artistName);
      items.forEach(item => {
        if (item.images.length !== 0) {
          item.images = item.images[1];
        } else {
          item.images = {
            url:
              "https://vinylboutique.co.uk/wp-content/uploads/2017/05/default-release-cd.png"
          };
        }
      });
      // res.send(items);
      res.render("albums", { items });
    })
    .catch(err => console.log(err));
});

app.get("/tracks/:trackId", (req, res) => {
  let { trackId } = req.params;
  // res.send(trackId);
  spotifyApi
    .getAlbumTracks(trackId)
    .then(data => {
      // console.log(data.body);
      let { items } = data.body;
      // res.send(items);
      res.render("tracks", { items });
    })
    .catch(err => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
