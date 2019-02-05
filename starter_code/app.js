const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = "614fda3af23a4f84bed367a571e1bece",
  clientSecret = "e6bd8d2dd51d49b6b71698351cef83e7";

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

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");

app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { search_query } = request.query;

  spotifyApi
    .searchArtists(search_query)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // response.json(data);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.locals.artistList = data.body.artists.items;

      // don't forget to send the apiResult to the HBS
      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching ARTISTS occurred: ", err);
      response.send("There was an error while searching for artists");
    });

  // response.locals.userText = search_query;
});

app.get("/albums/:artistId", (request, response, next) => {
  const { artistId } = request.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);

      response.locals.albumList = data.body.items;
      // response.locals.artistAlbumId = artistId;

      // don't forget to send the apiResult to the HBS
      response.render("albums.hbs");
    })
    .catch(err => {
      console.log("The error while searching ALBUMS occurred: ", err);
      response.send("There was an error while searching for albums");
    });
});
