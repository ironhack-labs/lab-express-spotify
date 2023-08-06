require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api:
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




//    ROUTS:
// Rendering a rout that displays a search bar
// 1)
app.get("/", (req, res) => {
  res.render("index");
});

//Searching for specific artist
// 2)
app.get("/artist-search", async (req, res) => {
    try {
      const { artist } = req.query;
      searchedArtists = await spotifyApi.searchArtists(artist);
      const artists = searchedArtists.body.artists.items;
      res.render("artist-search-results", { artists });
    } catch (error) {
      console.log("Error:", error);
    }
  });

// app.get("/artist-search", (req, res) => {
//   // Search Artist Route:
//   let { artist } = req.query;
//   spotifyApi
//     .searchArtists(artist)
//     .then((data) => {
//       console.log("The received data from the API:", data.body.artists.items);
//       res.render("search-artist", { artists: data.body.artists.items });
//       // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     })
//     .catch((err) =>
//       console.log("The error while searching artists occurred:", err)
//     );
// });


//Creating a route to the albums
// 3)
app.get('/albums/:artistId', async (req, res, next) => {
    // .getArtistAlbums() code goes here
    try {
    const {artistId} = req.params  
    let searchAlbum = await spotifyApi.getArtistAlbums(artistId);
    const albums = searchAlbum.body.items;
    res.render("albums", { albums });

    }catch (error) {
        console.log("Error", error);
    }
  });


// 4)
  app.get('/albums/:albumId', async (req, res, next) => {
    // .getTracks()code goes here
    try {
        //hint 
    const {albumId} = req.params  
    let searchTracks = await spotifyApi.getTracks(albumId);
    const tracks = searchTracks.body.items;
    res.render("album-tracks", { tracks });

    }catch (error) {
        console.log("Error", error);
    }
  });






app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
// 127.0.0.1 reflects to the localhost
