const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyparser = require('body-parser')
const debug = require('debug')('irondemo:app');
const SpotifyWebApi = require('spotify-web-api-node');
const port = 3000;
let artistData;
let albumsNumber = 50;


// const expressLayouts     = require('express-ejs-layouts');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

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
  if (req.body.artistName != undefined) {
    console.log("function processing input is called in middleware");
  }
  next();
});

app.get('/', (req, res) => {
  console.log("Landing page rendered...");
  res.render('index');
});

app.post('/artists', (req, res) => {
  console.log("artists requested");
  console.log(req.body.artistName);
  spotifyApi.searchArtists(req.body.artistName)
    .then(data => {
      artistData = {
        name: data.body.artists.items[0].name,
        id: data.body.artists.items[0].id
      }
      // console.log(data.body.artists.items[0].name);
      //console.log(artistData);
      spotifyApi.getArtistAlbums(
        artistData.id,
        { limit: albumsNumber, offset: 0 },
        function (err, data) {
          if (err) {
            console.error('Oh! Algo pasa al buscar info sobre el album!');
          } else {
            // console.log(data.body.items[0]);
            // console.log(data.body);
            console.log(parseSpotifyAlbums(artistData.name,data))
            res.render('artists',
            parseSpotifyAlbums(artistData.name,data)); 
          }
        }
      );
    })
    .catch(err => {
      console.log("Error in searchASritsts")
    });
})


app.get('/albums', (req, res) => {
  res.render('home', { XXXX });
})

app.get('/tracks', (req, res) => {
  res.render('home', { XXXX });
})

app.listen(port, () => console.log(`Ready on http://localhost:${port}`));

parseSpotifyAlbums = function (artName, data) {
  let albumArr = [];
  for (i = 0; i < albumsNumber; i++) {
    if (data.body.items[i].album_type == 'album') {
      albumArr.push({
        albumName: data.body.items[i].name,
        albumCoverUrl: data.body.items[i].images[0].url
      })
    }
  }
  return { name: artName, albums: albumArr.reverse() };
}













