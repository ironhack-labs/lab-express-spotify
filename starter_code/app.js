const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
// Remember to insert your credentials here

const clientId = "a3ccb81673fc4d118035733322d59707",
  clientSecret = "adadb7a20dfc44deae1c2a95b8f759f3";

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
// the routes go here:

app.get("/", (request, response, next) => {
  response.render("home.hbs");
});

app.get("/artists", (request, response, next) => {
  spotifyApi
    .searchArtists(request.query.search_query)
    .then(data => {
      // response.json(data.body.artists.items);
      response.locals.userText = data.body.artists.items;

      console.log("The received data from the API: ", data.body.artists.items);
      response.render("artists.hbs");
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (request, response, next) => {
  spotifyApi.getArtistAlbums(request.params.artistId).then(
    data => {
      // console.log("Artist albums", data.body.items);

      response.locals.albumsViews = data.body.items;
      response.render("albums.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:artistId", (request, response, next) => {
  // Get tracks in an album
  spotifyApi.getAlbumTracks(request.params.artistId).then(
    data => {
      response.locals.trackViews = data.body.items;
      response.render("tracks.hbs");
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
