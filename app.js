require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
hbs.registerPartials(__dirname + '/views/partials/')

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


/*ROUTES*/
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
  res.render('index', {
    layout: false
  });
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artists = data.body.artists.items;
      res.render('artist-search-results', {
        artists
      })
    })
    .catch(err => console.error(err));
})

app.get('/albums/:id', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      const albums = data.body.items
      res.render('artist-albums', {albums})
    })
    .catch(err => console.error(err))
})

app.get('/tracks/:id', (req, res) => {
  spotifyApi
   .getAlbumTracks(req.params.id) 
   .then(data => res.send(data.body.items))
   .catch(e => console.error(e))
})

app.listen(3000, () => {
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
  const d = new Date()
  console.log(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`)
});