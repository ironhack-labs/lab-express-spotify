require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log(data, data.body);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res) => {
  const musician = req.query["artist-name"];

  spotifyApi.searchArtists(musician).then(
     data => {
      console.log(data.body.artists.items[0]);
      res.render('artist-search.hbs', {"artistArray" : data.body.artists.items});
    })
    .catch(error => {
        console.log('Error retrieving artists: ', error);
        res.send('error retrieving artists');
    }
  );
});



app.get("/albums/:artistId", (req, res) => {
let artistId;
  // How to get artist id???
  console.log(req.params.artistId)

  spotifyApi.getArtistAlbums((req.params.artistId))
  .then(function(data) {
    console.log('Artist albums', data.body.items);
    res.render('albums.hbs', {"albumArray" : data.body.items});
  })
    .catch(error => {
      console.log('Error retrieving albums: ', error);
      res.send('error retrieving albums');
  }
)
})


// Get tracks in an album
app.get("/albums/tracks/:albumId", (req, res) => {
  let albumId;

  console.log(req.params.albumId)
spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    console.log('Album tracks', data.body.items);
    res.render('tracks.hbs', {"trackArray" : data.body.items});
  })
  .catch(error => {
    console.log('Error retrieving tracks: ', error);
    res.send('error retrieving tracks')
  })
})



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
