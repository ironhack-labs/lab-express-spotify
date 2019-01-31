const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "415ca796ff7c473cbd097e241ce0b42b",
  clientSecret = "0abf32bc627041f2bb0f418e22800cd1";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// retrieve an access token.
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/artists", (req, res) => {
	// console.log("TCL: req.params", req.query);
  spotifyApi
    .searchArtists(req.query["artist-name"])
    .then(data => {
			// console.log("TCL: data.body.artists.items", data.body.artists.items);
      res.render("artists", {
        artists: data.body.artists.items
      });
      // res.send(data.body.artists.items)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
app.get("/albums/:artistId", (req, res) => {
	// console.log("TCL: req.params", req.params);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
			// console.log("TCL: data.body.items", data.body.items);
      res.render("albums", {
        albums: data.body.items
      });
      // res.send(data.body.items);
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});
app.get("/tracks/:albumId", (req, res) => {
	// console.log("TCL: req.params", req.params);
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
			// console.log("TCL: data.body.items", data.body.items);
      res.render("tracks", {
        tracks: data.body.items
      });
      // res.send(data.body.items);
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🔊"));
