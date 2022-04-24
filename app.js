require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

app.get('/', (req, res, next) => res.render('home'));


// search Artist
app.get('/artist-search', (req, res, next) => {
  const searchArtist = req.query.artist
  let page
  if (req.query.page) page = parseInt(req.query.page);
  else page = 1;


  spotifyApi
    .searchArtists(searchArtist, { limit: 20, offset: page * 20 })
    .then(data => {

      let nextPage;
      let previousPage;
      const totalArtist = parseInt(data.body.artists.total)

      if (page > 1) previousPage = page - 1
      if (page < Math.floor(totalArtist / 20)) nextPage = page + 1;

      // console.log(data.body.artists.total, page);
      res.render("artist-search-results", { artists: data.body.artists.items, searchArtist, page, nextPage, previousPage })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})




//view the Album
app.get('/albums/:id', (req, res, next) => {
  const id = req.params.id;

  spotifyApi
    .getArtistAlbums(id)
    .then(data => res.render("albums", { albums: data.body.items }))
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


//view Tracks and play them
app.get('/albums/:albumId/tracks/:id', (req, res, next) => {
  const id = req.params.id;
  spotifyApi
    .getAlbumTracks(id)
    .then(data => res.render("tracks", { tracks: data.body.items }))
    .catch(err => console.log('The error while searching artists occurred: ', err));
})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
