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

//extraer token de acceso
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

//middleware


// Our routes go here:

app.get('/', (req, res) => 
    res.render('index', {title: 'Spotify lab'})
)

app.get('/artist-search', (req, res) => {
    const { artist } = req.query;

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      res.render('album', { albums: data.body.items }); //  busca views/album.hbs
    })
    .catch(err => console.log(err));
});

app.get('/view-tracks/:albumId', (req, res) => {
  const { albumId } = req.params
  spotifyApi
    .getAlbumTracks(albumId, { limit: 20, market: 'ES'})
    .then(data => {
      console.log(data.body)
      res.render('view-tracks', {tracks: data.body.items})})
    .then(err => console.log('Algo fue mal', err))
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
