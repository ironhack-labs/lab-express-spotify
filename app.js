require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
  res.status(200).render("index");
})

app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

  spotifyApi
  .searchArtists(artistName)
  .then((data) => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.status(200).render("artist-search-results", { artists: data.body.artists.items, });
  })
  .catch((err) => console.log('The error while searching artists occurred: ', err));
})

app.get("/", (req, res) => {
  res.status(200).render("index");
})

app.get("/albums/:artistId", (req, res) => {
  
  const { artistId } = req.params;
  
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    const { items } = data.body;
    res.status(200).render("albums", { albums: items });
  })
  .catch(err => console.log(`The error for artist album occured: ${err}`));
});
  
app.get("/tracks/:tracksId", (req, res) => {
  const { tracksId } = req.params;

  spotifyApi
    .getAlbumTracks(tracksId)
    .then((data) => {
      const { items } = data.body;

      res.status(200).render("tracks", { tracks: items });
      // console.log(`Got sound tracks! ${data}`);
    })
    .catch((err) => {
      console.error(`Error trying to get sound tracks: ${err}`);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));