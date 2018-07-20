// Client ID aee227a9c4c04f8da1bc944db41aa843
// Client Secret 5f81b2f91dd44a8a953c4392b0860cd3
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const clientId = 'aee227a9c4c04f8da1bc944db41aa843',
      clientSecret = '7555bbb1e9bd4d6eabd945e8d7a51bd5',
      accessToken = '';

const spotifyApi = new SpotifyWebApi({
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


app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  //--> browser me dice: cannot post /artists
  // const artistsSearch = req.query.artists
  // spotifyApi.searchArtists(artistsSearch)
  spotifyApi.searchArtists('iron maiden')
    .then(result => {
      const resultArtist = result.body.artists.items
      // console.log(resultArtist);
      // console.log('imagenes', resultArtist.items[0].images)
      res.render('artists', {resultArtist});
  }).catch(err => {
      console.log('err', err)
    })
});

// app.get('/album/:artistId', (req, res, next) => {
//   const albumSearch = req.params.artistID
//   .then(result => {

//     res.render(albumSearch);
//   })
//   .catch(err => {
//     console.log('err', err)
//   })
// });

// app.get('/tracks/:albumID', (req, res, next) => {
//   const trackSearch = req.params.albumID;
//   spotifyApi.getAlbumTracks()
//   .then(result => {

//     res.render('tracks');
//   })
//   .catch(err => {
//     console.log('err', err)
//   })
// });

app.listen(3000, () => console.log('Port 3000 running'));