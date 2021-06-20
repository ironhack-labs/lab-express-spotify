require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => {
    res.render("index");
});

app.get("/artist-search", (req, res, next) => {
   const { search } = req.query;

   spotifyApi
  .searchArtists(search)
  .then((data) => {
    console.log('The received data from the API: ', data.body);
        const result = data.body.artists.items;
        console.log(result);
        res.render("artist-search-results", {result})
        
    })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;

    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const {items} = data.body;
      res.render("albums", {albums: items,})
    })
    .catch(err => console.error(`failed to load album ${err}`))
  });

  app.get('/tracks/:tracksId', (req, res, next) => {
    const {tracksId} = req.params;
    
    spotifyApi
    .getAlbumTracks(tracksId)
    .then((data) => {
      const {items} = data.body;
      res.status(200).render("tracks", {tracks: items,})
    })
    .catch(err => console.error(`failed to load album ${err}`))
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
