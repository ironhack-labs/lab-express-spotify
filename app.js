require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

//***************************Setting up Spotify API**************************

// Install the spotify npm package that holds all the methods we need
const SpotifyWebApi = require("spotify-web-api-node");

// Register to use the spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log("The access token expires in " + data.body['expires_in'])
    spotifyApi.setAccessToken(data.body["access_token"])})
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

//*********************************************************************************** */

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public")); 


// Routing

// ROUTE: Display the form to users so they can search for artists
app.get(`/`, (req, res) => {
  res.render("index");
});

// ROUTE: Searching for an artist
// app.get("/artist-search", async (req, res) => {
//   try {
//     const { searchTerm } = req.query;
//     const filteredArtistsObject = await spotifyApi.searchArtists(searchTerm);
//     const { items: foundArtists } = filteredArtistsObject.body.artists;
//     res.render("artist-search-result", { artists: foundArtists });
//   } catch (error) {
//     res.status(500).json({ error: `${error}` });
//   }
// });

app.get("/artist-search", async (req, res) => {
  try {
    const data = await spotifyApi.searchArtists(req.query.searchTerm);
    console.log("The received data from the API: ", data.body.artists.items[0] )
    // res.json(data.body.artists.items)
    res.render("artist-search-result", { artists: data.body.artists.items });

  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});


// ROUTE: Viewing all albums of an artist
app.get('/albums/:artistId', async (req, res) => {
  try {
    const artistData = await spotifyApi.getArtistAlbums(req.params.artistId)
    // res.json(artistData.body.items)
    res.render('albums', { albums: artistData.body.items})
  } catch (error) {
    console.log("Error while loading artist album", error)
  }
});

// ROUTE: Viewing all tracks of an album by albumId
app.get('/album/tracks/:albumId', async (req,res) => {
  try {
   const albumTracksData = await spotifyApi.getAlbumTracks(req.params.albumId, { limit : 20, offset : 0 })
   const albumInfoData = await spotifyApi.getAlbum(req.params.albumId)
   const albumData = {
    tracks: albumTracksData.body.items,
    info: albumInfoData.body
   }
  //  res.json(albumData)
   res.render('tracks', albumData)
  } catch (error) {
    console.log("Error while loading artist album", error)
  }
})


app.listen(process.env.PORT, () =>
  console.log(`My Spotify project running on port ${process.env.PORT} 🎧`)
);
