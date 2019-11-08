require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
hbs.registerPartials(__dirname + "/views/partials");
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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (request, response) => {
  response.render("index.hbs");
});

app.get("/artists", (request, response) => {
  //   response.send(request.query.q);
  const searchString = request.query.q;
  //response.render("artists.hbs");
  console.log(request.query.q);
  spotifyApi.searchArtists(request.query.q).then(data => {
    console.log("LOOOOK HERE ", data.body.artists.items);
    response.render("artists", { items: data.body.artists.items });
  });

  app.get("/albums/:id", (request, response, next) => {
    spotifyApi.getArtistAlbums(request.params.id).then(
      function(data) {
        console.log("Artist albums", data.body);

        response.render("albums", { albums: data.body.items });
      },
      function(err) {
        console.error(err);
      }
    );
  });

  app.get("/tracks/:id", (request, response, next) => {
    spotifyApi
      .getAlbumTracks(request.params.id)
      .then(function(data) {
        // response.send(data.body.items);
        console.log("Artist tracks", data.body.items.preview_url);

        response.render("tracks", { tracks: data.body.items });
      })
      .catch(error => {
        console.log(
          "Something went wrong when retrieving an access token",
          error
        );
      });
  });

  //   spotifyApi
  //     .searchArtists("Madonna")
  //     .then(data => {
  //       console.log("The received data from the API: ", data.body);
  //       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  //       const items = data.body.items;
  //       const filtered = items.filter(item => {
  //         if (item.name.toLowerCase().includes(searchString.toLowerCase)) {
  //           return true;
  //         }
  //       });
  //       response.render("artists.hbs", { artistsList: items });
  //     })
  //     .catch(err => {
  //       console.log("The error while searching artists occurred: ", err);
  //     });
  // const filtered = artists.filter(player.)
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
