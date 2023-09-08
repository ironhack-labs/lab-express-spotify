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
   .then(data => 
    spotifyApi.setAccessToken(data.body['access_token']))
   .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render("index");
})

app.get('/artist-search', (req, res) => {
    const { artistName } = req.query;
    // res.send(`You searched for artist ${artistName}`);/
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
    console.log('The received data from the API: ', data.body);

    const artistData = data.body.artists.items;
    console.log(artistData);

    res.render("artist-search-results", {artistData})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res) => {
  const { artistId } = req.params

  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    console.log('This is album Data from the API:', data);
    
    const albuminfo = data.body.items
    res.render("albums",{albuminfo})
  })
  .catch(err => console.log(`Error occured whilst searching for albums:`, err))
})

app.get("/tracks/:albumId", (req, res) => {

  const {albumId} = req.params

  spotifyApi
  .getAlbumTracks(albumId)
  .then(trackData => {
    console.log('The received track data from the API:', data)

    const tracksInfo = data.body.items
    res.render("tracks", {tracksInfo})
  })
  .catch(err => console.log('The error while searching track occurred: ', err));
});

app.get("/tracks/:albumID", (req, res) => {
  const { albumID } = req.params;
  
  spotifyApi
      .getAlbumTracks(albumID)
      .then(data => {
          console.log('The received data from the API: ', data);
          const tracksInfo = data.body.items
  
          res.render("tracks", { tracksInfo })
      })
      .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
