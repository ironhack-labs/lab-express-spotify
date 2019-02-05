const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const clientId = "1e186d3c659d46958a8c9c7effcf5a23",
  clientSecret = "6afe45a436724fa694d14f10344a1992";

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
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { search_query } = request.query;
  response.locals.searchedArtist = search_query;

  spotifyApi
    .searchArtists(search_query)
    .then(data => {
      response.locals.artistsList = data.body.artists.items;
      //response.json(data);
      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id/:name", (request, response, next) => {
  const { id, name } = request.params;
  response.locals.artistId = id;
  response.locals.artistName = name;

  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      console.log("All albums from this artist:", data.body);
      response.locals.albumsList = data.body.items;
      //response.json(data);
      response.render("albums.hbs");
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/tracks/:id/:name", (request, response, next) => {
  const { id, name } = request.params;
  response.locals.albumId = id;
  response.locals.albumName = name;

  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      console.log("Tracks list from the album:", data.body);
      response.locals.tracksList = data.body.items;
      //response.json(data);
      response.render("tracks.hbs");
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
