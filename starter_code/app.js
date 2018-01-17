var SpotifyWebApi = require('spotify-web-api-node');

// My Credentials to connect with the API
var clientId = '32b37c52347645008746a05864ad8c48',
  clientSecret = 'b5ad69b5d478449c9afcececf99fc248';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
/* require modules */
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//Con esto le decimos que vamos a utilizar el bodyParser

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/* Middlewares config */

app.use(expressLayouts);
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main-layout');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
  morgan(
    `Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`
  )
);
/* Routes */

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  //res.send(req.body.artist);
  spotifyApi
    //req.body.artist hace referencia a lo que pido en mi formulario
    // body es el cuerpo del formulario y artist es el atributo name
    .searchArtists(req.body.artist)
    // response es lo que recibo de la función
    .then(
      response => {
        //para saber lo que me devuelve hago un console.log
        console.log(response);
        //Aqui renderizo la vista
        res.render('artists', {
          //declaro las variables que voy a utilizar en la vista
          data: response,
          artistName: req.body.artist
        });
      },
      function(err) {
        console.error(err);
      }
    );
});
app.get('/artists', (req, res, next) => {
  res.render('artists');
});

app.get('/albums/:artistId', (req, res) => {
  //para saber el elemento que tengo que añadir a la url que
  // en este caso es /:artistId
  //console.log(req.params);
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      res.render('albums', {
        //defino data como todos los datos que me llegan y a partir
        // de ahi le voy pidiendo lo que necesito
        data: data.body,
        band: data.body.items[0].artists[0].name
      });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  // Get tracks in an album
  spotifyApi.getAlbum(req.params.albumId).then(
    data => {
      // console.log(data.body);
      res.render('tracks', {
        album: data.body,
        tracks: data.body.tracks.items,
        band: data.body.artists[0].name
      });
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
});

app.listen(3000, () => console.log('You Can Do It!'));
