require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const app = express();

// Iteration 1
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApiClient = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Retrieve an access token
(async function configSpotifyApi() {
  app.set("view engine", "hbs");
  app.set("views", __dirname + "/views");
  app.use(express.static(__dirname + "/public"));
  hbs.registerPartials(__dirname + "/views/partials");

  try {
    const result = await spotifyApiClient.clientCredentialsGrant();
    await spotifyApiClient.setAccessToken(result.body["access_token"]);

    // Our routes go here:

    app.get("/", (req, res) => {
      return res.render("homepage");
    });

    app.get("/artist-search", async (req, res) => {
      const artist = req.query.artist;
      const artistData = await spotifyApiClient.searchArtists(artist);
      // return res.send(JSON.stringify(artistData.body.artists.items));
      res.render('artist-search-results', {artist: artistData.body.artists.items})
    });

    app.get('/albums/:artistId', async (req, res, next) => {
      const artistAlbum = await spotifyApiClient.getArtistAlbums(req.params.artistId)
      const albums = artistAlbum.body.items
      res.render('albums', {albums})
    });

    app.get('/albums/tracks/:trackId', async (req, res, next) => {
      const albumsTracks = await spotifyApiClient.getAlbumTracks(req.params.trackId)
      const tracks = albumsTracks.body.items
      // res.send(tracks)
      res.render('tracks', {tracks})
    });


    app.listen(process.env.PORT || 3000, () =>
      console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
    );
  } catch (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
})();