const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const app = express();

// Remember to paste here your credentials
const clientId = 'cd668287e7bb4d12b4d784a58186b465',
  clientSecret = '168fcfcd6af54b08b872fb28dbe88c53';

let spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
  res.render('index');
})

app.get('/artists', (req, res) => {
  let artistObj = req.query;
  spotifyApi.searchArtists(artistObj.artist)
    .then(data => {
      let artists = data.body.artists.items;
      //console.log(artists);
      res.render('artists', { artists })
    })
    .catch(err => {
      throw Error("Found a problem. Artist");
    })
})

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      console.log(data.body.items[0])
      let albums = data.body.items;
      res.render('albums', { albums })
    })
    .catch(err => {
      throw Error("Found a problem. Albums")
    })
})


app.listen(3000, () => {
  console.log("Listening")
}); 