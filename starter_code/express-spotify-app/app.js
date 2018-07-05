const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyparser = require('body-parser')
const debug = require('debug')('irondemo:app');
const SpotifyWebApi = require('spotify-web-api-node');
const port = 3000;
let artistData;

// const expressLayouts     = require('express-ejs-layouts');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname + '/views/partials'));

// Remember to paste here your credentials
const clientId = '00f680a074fd40cea31130315e5e789f';
const clientSecret = 'c3604e29fee74507955d72aca0e6850b';
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify access granted!!!');
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


//////////// MIDDLEWARE
app.use(bodyparser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(req.body.artistName);
  if (req.query.artistName != undefined) {
    // console.log("function processing input is called");
    spotifyApi.searchArtists(req.query.artistName)
      .then(data => {
        artistData = {
          name: data.body.artists.items[0].name,
          id: data.body.artists.items[0].id
        }
        // console.log(data.body.artists.items[0].name);
        console.log(artistData);
        req.artistData=artistData;
      })
      .catch(err => {
        console.log("Error en la api de spoti")
      });
  }
  next();
});

app.get('/', (req, res) => {
  console.log("Landing page rendered...");
  res.render('index');
});

app.post('/artists', (req, res) => {
  console.log("artists requested");
  console.log(req.artistData);
  spotifyApi.getArtistAlbums(
    artistSearch.id,
    { limit: 50, offset: 0 },
    function(err, data) {
      if (err) {
        console.error('Oh! Algo pasa al buscar info sobre el album!');
      } else {
        console.log(data);
      }
    }
  );
  // const {ta,color} = req.query; 
  // res.render('home',{XXXX});
})


app.get('/albums', (req, res) => {
  res.render('home', { XXXX });
})

app.get('/tracks', (req, res) => {
  res.render('home', { XXXX });
})


app.listen(port, () => console.log(`Ready on http://localhost:${port}`));


// { body: 
//   { artists: 
//      { href: 'https://api.spotify.com/v1/search?query=cold+play&type=artist&offset=0&limit=20',
//        items: [1,1,1,1,1],
//        limit: 20,
//        next: null,
//        offset: 0,
//        previous: null,
//        total: 3 } },
//  headers: 
//   { 'content-type': 'application/json; charset=utf-8',
//     'cache-control': 'public, max-age=7200',
//     'access-control-allow-origin': '*',
//     'access-control-allow-headers': 'Accept, Authorization, Origin, Content-Type, Retry-After',
//     'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
//     'access-control-allow-credentials': 'true',
//     'access-control-max-age': '604800',
//     'content-encoding': 'gzip',
//     date: 'Thu, 05 Jul 2018 18:17:37 GMT',
//     via: '1.1 google',
//     'alt-svc': 'clear',
//     connection: 'close',
//     'transfer-encoding': 'chunked' },
//  statusCode: 200 }




[{
  external_urls:
    { spotify: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU' },
  followers: { href: null, total: 12989017 },
  genres: ['permanent wave', 'pop'],
  href: 'https://api.spotify.com/v1/artists/4gzpq5DPGxSnKTe4SA8HAU',
  id: '4gzpq5DPGxSnKTe4SA8HAU',
  images: [[Object], [Object], [Object], [Object]],
  name: 'Coldplay',
  popularity: 85,
  type: 'artist',
  uri: 'spotify:artist:4gzpq5DPGxSnKTe4SA8HAU'
},
{
  external_urls:
    { spotify: 'https://open.spotify.com/artist/1rPwjoAR4afwbBvIqnGozZ' },
  followers: { href: null, total: 99 },
  genres: [],
  href: 'https://api.spotify.com/v1/artists/1rPwjoAR4afwbBvIqnGozZ',
  id: '1rPwjoAR4afwbBvIqnGozZ',
  images: [[Object], [Object], [Object]],
  name: 'cold play music',
  popularity: 1,
  type: 'artist',
  uri: 'spotify:artist:1rPwjoAR4afwbBvIqnGozZ'
},
{
  external_urls:
    { spotify: 'https://open.spotify.com/artist/4dN093YINZ9EVp4hajmQQr' },
  followers: { href: null, total: 3564 },
  genres: [],
  href: 'https://api.spotify.com/v1/artists/4dN093YINZ9EVp4hajmQQr',
  id: '4dN093YINZ9EVp4hajmQQr',
  images: [[Object], [Object], [Object]],
  name: 'The Islandors, Cold Play & Steel Performances',
  popularity: 4,
  type: 'artist',
  uri: 'spotify:artist:4dN093YINZ9EVp4hajmQQr'
}]












