const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const clientId = "285343778767412c89c8a3549afd7842",
  clientSecret = "f72c74c9e24e457dac6393c6da78c45a";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
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

const app = express();
app.use(express.static(__dirname + "/public"));
// app.use(express.static("public"));
app.set("view engine", "hbs"); // don't get it !!!!!!
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  // console.log(req.query)
  // console.log(req.body)
  // const data = {
  //   title: "Contact"
  // };
  res.render("index");
});

app.get("/artists", (req, res) => {
  console.log(req.query);

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // arr.forEach(item => {
      console.log(data.body.artists.items[0].images[0].url);
      //   item.images.forEach(image => {
      //     console.log(image.url);
      //   })
      // });
      // res.json(data.body)
      res.render("artists", { artists: data.body.artists.items });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log("Artist albums", data.body);
      // res.json(data.body.items);

     res.render("albums", {albums: data.body.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});


app.get("/tracks/:artistId", (req, res, next) => {
  console.log(req.params);
  spotifyApi
    .getAlbumTracks(req.params.artistId)
    .then(data => {
      // console.log("albums tracks", data.body);
      // res.json(data.body);

     res.render("tracks", {tracks: data.body.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});


// setting the spotify-api goes here:

// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
