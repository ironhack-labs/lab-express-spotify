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
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artistQuery = req.query;
  const artistString = artistQuery.artistName;

  spotifyApi
    .searchArtists(artistString, { limit: 10 })
    .then((data) => {
      let artistArr = [];
      for (let artist of data.body.artists.items) {
        let artistImage =
          artist.images.length > 1 ? artist.images[0].url : "/images/anon.jpg";
        const subsetArtist = (({ name, images, id }) => ({ name, images, id }))(
          artist
        );
        subsetArtist.images = artistImage;
        artistArr.push(subsetArtist);
      }
      res.render("artist-search-results", {
        searchResult: artistArr,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((albums) => {
      let albumArr = [];
      for (let item of albums.body.items) {
        const subsetAlbum = (({ images, name, id }) => ({
          images: images[0].url,
          name,
          id,
        }))(item);
        albumArr.push(subsetAlbum);
      }
      res.render("albums", { album: albumArr });
    })
    .catch((err) => console.log("Album request no good.", err));
});

app.get("/tracks/:id", (req, res, next) => {
    spotifyApi
      .getAlbumTracks(req.params.id)
      .then((album) => {
        let trackArr = []
        for (let track of album.body.items) {
          const trackSubset = (({name, preview_url}) => ({name, preview_url}))(track)
          trackArr.push(trackSubset)
        }
        console.log(trackArr)
        res.render("tracks", {track : trackArr});
      })
      .catch((err) => {
        console.log("Track request no good", err);
      });
    });

app.listen(3000, () => {
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊");
});
