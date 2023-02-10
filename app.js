require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const app = express();

const SpotifyWebApi = require('spotify-web-api-node'); 

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get("/", (req,res) => {
  res.render("index")
});

app.get('/artist-search-results', (req, res) => {
  const query = req.query.q;
  spotifyApi
    .searchArtists(query)
    .then(data => {
      const artist = data.body.artists.items;
      res.render("artist-search-results", { artist });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
      .then((data) => {
        const albums = data.body.items;
        res.render('albums', { albums, artistName: 'Artist Name' });
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  });
app.get('/tracks/:albumId', (req,res) => {
  const id = req.params.albumId;
  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      const tracks = data.body.items;
      res.render("tracks", {tracks});
    })
    .catch(err => console.log(err));
});

    app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));