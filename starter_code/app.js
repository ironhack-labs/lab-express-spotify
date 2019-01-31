const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId = '3ce2b9f8730c497bb87dfd37d4e25ac1';
const clientSecret = 'e08b204786f34eebb0df10a31a4df5b6';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

app.get("/", (req, res) => {
  res.render('index')
})

app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => res.render('artists', { artistArr: data.body.artists.items }))
    .catch(err => console.log("The error while searching artists occurred: ", err))
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => res.render('albums', { albumsArr: data.body.items }))
    .catch(err => console.error(err));
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => res.render('tracks', { tracksArr: data.body.items }))
    .catch(err => console.error(err))
})

app.listen(2400, () => console.log("My Spotify project running on port 2400 🎧 🥁 🎸 🔊"));