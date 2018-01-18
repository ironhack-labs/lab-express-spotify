const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const app = express();


//Spotify API
const clientId = '1cb4654aa7314448b84a632d840e29f5',
    clientSecret = '1660cfe3b05846ffa0579b6a3d3489f9';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token to Spotify
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token from Spotify', err);
});


/* Middlewares config */
app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('layout', 'layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//
/* App routes */
//

//esto configura lo que va a mostrar en la ruta princiapl
app.get('/', (req, res)=>{
    res.render('index');
});

//esto configura lo que va a mostrar cuando le pidamos un artista en el formulario
app.get('/artists', (req, res) => {
    let artist = req.query.artist;
  
    spotifyApi.searchArtists(req.query.artist)
      .then(function(data) {
        res.render('artists', {
          artists: data.body.artists.items
        });
      }, function(err) {
        console.log('F*ck, Something went wrong!', err);
      });
  });



// Levantamos el servidor
app.listen(3000, () => console.log('servidor levantado!'));
