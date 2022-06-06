require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/",(req,res,next)=>{
  res.render("home")
})
                
app.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
  const {artistId} = req.params

  spotifyApi
  .getArtistAlbums(artistId)
  .then((data) => {
    res.render("albums", { album: data.body.items });
  })
  .catch((err) =>
  console.log("The error while searching albums occurred: ", err)
);
});

app.get('/tracks/:albumId/', (req, res, next) => {
  const {albumId} = req.params

  spotifyApi
  .getAlbumTracks(albumId)
  .then((data) => {
    res.render("tracks", { tracks: data.body.items });
  })
  .catch((err) =>
  console.log("The error while searching albums occurred: ", err)
);
});


//turn on server
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
