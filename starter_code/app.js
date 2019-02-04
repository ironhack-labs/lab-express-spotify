const express = require("express");
const app = express();
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const clientId = "fc5f35b9531a45c2ac213879d893f0da",
  clientSecret = "f787df2e7ff54b03bdedd08d8662ce67";

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

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// Routes
// ----------------------------------------------------------------------------------------------------------

app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

// spotifyApi
//   .searchArtists("Nine Inch Nails")
//   .then(data => {
//     console.log("The received data from the API: ", data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => {
//     console.log("The error while searching artists occurred: ", err);
//   });

// get Elvis' albums, using Promises through Promise, Q or when
// spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
//   function(data) {
//     console.log("Artist albums", data);
//   },
//   function(err) {
//     console.error(err);
//   }
// );

app.get("/artists", (request, response, next) => {
  const { search_query } = request.query;
  spotifyApi.searchArtists(search_query).then(
    function(data) {
      response.locals.artistsData = data.body.artists.items;
      // response.json(data.body.artists.items);
      console.log("Artist albums", data);
      response.render("artists.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (request, response, next) => {
  const { artistId } = request.params;
  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      response.locals.artistAlbumsId = data.body;
      console.log("Artist albums", data);
      response.json(data.body.items);
      response.render("albums.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});
