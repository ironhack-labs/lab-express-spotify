require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home.hbs");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
    //   console.log("The received data from the API: ", data.body);
      const {
        artists: { items },
      } = data.body;
      // console.log(items[0].images[0].url)
      let newArtists = items.map((artist) => {
        let img = "/images/default.jpg";

        if (artist.images.length > 0) {
          img = artist.images[0].url;
        }

        let name = artist.name;
        let id = artist.id;
        return { img, name, id };
      });
      res.render("artist-search-results.hbs", { newArtists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId
    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
            const { items } = data.body;
              // console.log(items[0].images[0].url)
              let newAlbums = items.map((album) => {
                let img = "/images/default.jpg";
        
                if (album.images.length > 0) {
                  img = album.images[0].url;
                }
        
                let name = album.name;
                let id = album.id;
                return { img, name, id };
              });
              res.render("albums.hbs", { newAlbums });
        })
        .catch((err) => {
            console.log("The error while searching albums occurred: ", err)
        })
});

app.get("/tracks/:albumId", (req, res, next) => {
    let albumId = req.params.albumId
      spotifyApi.getAlbumTracks(albumId)
          .then((data) => {
              const { items } = data.body;
                console.log(items)
                let newTracks = items.map((track) => {
                  let song = track.preview_url;
                  let name = track.name;
                  return { song, name};
                });
                res.render("tracks.hbs", { newTracks });
          })
          .catch((err) => {
              console.log("The error while searching albums occurred: ", err)
          })
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
