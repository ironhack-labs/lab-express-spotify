require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  const data = await spotifyApi.searchArtists(req.query.artist);
  const dataToRender = [];
  for (artist of data.body.artists.items) dataToRender.push({
      name: artist.name,
      imageURL: artist.images.length === 0 ? '' : artist.images[0].url,
      id: artist.id,
  })
  res.render("artist-search-results", { dataToRender });
});

app.get("/albums/:artistId", async (req, res) => {
    const data = await spotifyApi.getArtistAlbums(req.params.artistId)
    const dataToRender = [];
    for (album of data.body.items) dataToRender.push({
        name: album.name,
        id: album.id,
        imageURL: album.images.length === 0 ? '' : album.images[0].url,
    })
    
    res.render('albums', {data: dataToRender, artist: data.body.items[0].artists[0].name})
})

app.get('/tracks/:tracksId', async (req, res) => {
    const data = await spotifyApi.getAlbumTracks(req.params.tracksId)
    const dataToRender = [];
    for (track of data.body.items) dataToRender.push({
        name: track.name,
        previewURL: track.preview_url,
    })
    res.render('tracks', {dataToRender})
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
