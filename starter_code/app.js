const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Remember to insert your credentials here
const clientId = "c1db7868528a484e93d537f89988c8aa",
  clientSecret = "82229033fb704be7ad1cf03bc7f29d3c";

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

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// the routes go here:
app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

// the routes go here:
// results page for the SEARCH feature (this route will have a QUERY STRING)
app.get("/artists", (request, response, next) => {
  // response.send(request.query);

  spotifyApi
    .searchArtists(request.query.search)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);

      // send data to template
      response.locals.artistsList = data.body.artists.items;
      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (request, response, next) => {
  //response.send(request.params);
  const { artistId } = request.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);

      //send data to template
      response.locals.albumsList = data.body.items;
      response.render("albums.hbs");
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get("/tracks/:albumId", (request, response, next) => {
  //response.send(request.params);
  const { albumId } = request.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);

      //send data to template
      response.locals.tracksList = data.body.items;
      response.render("tracks.hbs");
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    });
});
