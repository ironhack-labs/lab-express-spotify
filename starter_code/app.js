const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(`${__dirname}/views/partials`);
const bodyParser = require("body-parser");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

// spotify settings

const spotifyApi = new SpotifyWebApi({
  clientId: "57c4285787524ec8be118f03d3a36260",
  clientSecret: "605563e401d546768a69d763cc83e281"
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist", (req, res, next) => {
  console.log(req.query);
  const artistName = req.query.name;
  spotifyApi.searchArtists(artistName).then(
    data => {
      const dataArtist = data.body.artists.items;
      // console.log(dataArtist);
      res.render("artist", {
        dataArtist
      });
    },
    err => {
      console.error(err);
    }
  );
});

app.get("/albums/:albumsId", (req, res) => {
  const albums = req.params.albumsId;
  // console.log(albums);
  spotifyApi.getArtistAlbums(albums)
    .then(
      data => {
        const albumInfo = data.body.items;
        res.render("albumInfo", {
          albumInfo
        });
      },
      err => {
        console.error(err);
      }
    );
});


app.get("/albums/tracks/:trackId", (req, res) => {
  const tracks = req.params.trackId;
  console.log(tracks);
  spotifyApi.getAlbumTracks(tracks)
    .then(
      data => {
        const trackInfo = data.body.items;
        console.log(trackInfo)
        res.render("trackInfo", {trackInfo});
      },
      err => {
        console.error(err);
      }
    );
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);