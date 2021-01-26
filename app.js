require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

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
app.get('/', (req, res, next) => {
  res.render('index')

})


app.get('/search-artist', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then(data => {
      // console.log(data.body.artists)
      if (data.body.artists.total == 0) {
        res.render('no-results')
      } else {
        res.render('artist-search-results', { results: data.body.artists })
      }
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:name/:artistId', (req, res, next) => {
  let id = req.params.artistId;
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      if (data.body.items == 0) {
        res.render('no-results')
      } else {        
        res.render('albums', { results: data.body, name: req.params.name, id:id})
      }
    })
    .catch(err => console.log('Search error: ', err));
})

app.get('/tracks/:id', (req, res, next) => {
  console.log(req.params.id);
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      console.log(data.body)
      if (data.body.items == 0) {
        res.render('no-results')
      } else {        
        res.render('tracks', {results: data.body})
      }
    })
    .catch(err => console.log('Search error: ', err));
})

app.use((req, res, next) => {
  res.status(400)
  res.render('error')
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

