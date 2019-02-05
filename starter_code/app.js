const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "93233b4b649e4796adc8893792d868cf",
  clientSecret = "782dacd71c2744ae86fbbb92cc163abc";

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

app.listen(1234, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { search_query } = request.query;
  spotifyApi
    .searchArtists(search_query)
    .then(data => {
      // response.json(data);
      console.log("The received data from the API: ", data.body.artists.items);
      response.locals.search_query = data.body.artists.items;
      response.render("artists.hbs");
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (request, response, next) => {
  const { artistId } = request.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);
      response.locals.search_query = data.body.items;
      response.render("albums.hbs");
    })
    .catch(err => {
      console.error("The error while searching artists occurred: ", err);
    });
});

app.get("/tracks/:artistId", (request, response, next) => {
  const { artistId } = request.params;
  spotifyApi
    .getAlbumTracks(artistId, { limit: 10, offset: 1 })
    .then(data => {
      // response.json(data.body.items);
      response.locals.search_query = data.body.items;
      response.render("track-info.hbs");
      console.log(data.body);
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    });
});
