const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

const clientId = 'd5250ad8ffc2426b8205156bef2996b7';
const clientSecret = '9be41c1307f440e588fe014ed00a247a';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
.then( data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong retrieving access to a token', error));


app.get('/', (request, response, next) => {
  response.render('index');
});

app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist).then(data => {
    let artists = data.body.artists;
    let items = artists.items;
    res.render('artists', { items })
  })
  .catch(err => console.log("error while searching artists: ", err));
})

app.get('/albums/:artistId', (req, res, next) => {
  let artist = req.params.artistId;
  spotifyApi.getArtistAlbums(artist).then(data => {
    let items = data.body.items;
    res.render('albums', { items });
  })
  .catch(err => console.log("error while displaying albums: ", err));
});

app.get('/tracks/:albumId', (req, res, next) => {
  let album = req.params.albumId;
  spotifyApi.getAlbumTracks(album).then(data => {
    let items = data.body.items;
    console.log(data.body);
    res.render('tracks', { items });
  })
  .catch(err => console.log("error while displaying tracks: ", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
