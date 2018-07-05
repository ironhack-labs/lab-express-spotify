const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyparser = require("body-parser");

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "159d715ca6cb4307ab1a6a736547a63a",
  clientSecret = "4046be8eb08445e08d6f65a577713893";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(
  express.static(
    path.join(__dirname, "/express-spotify-app/express-spotify-app/public")
  )
);
hbs.registerPartials(__dirname + "/views/layouts/partials");
app.use(bodyparser.urlencoded({ extended: true }));

//Index Route

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/artists", (req, res, next) => {

  spotifyApi
    .searchArtists(req.body.artist)
    .then(data => {
      let artists = data.body.artists.items;
      console.log(artists[0].images[0].url);
      res.render("artists", { artists });
      // artists.foreach(e => {
      //   if (e.images.lenght == 0) {
      //     e.imgUrl =
      //       "https://artists.ludwig-musser.com/application/themes/ludwig_musser/assets/images/artist-list-default.jpg";
      //   } else {
      //     e.imgUrl = e.images[0].url;
      //   }
      // });
      
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });

    // app.get('/albums/:artistId', (req, res) => {
    //   spotifyApi
    //   .getArtistAlbums(req.params.artistId);
    //   .then (data => {
    //     res.render ("albums", { data})
    //   }
    // });



});

app.listen(3000, () => {
  console.log("Escuchando");
});
