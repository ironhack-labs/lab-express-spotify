const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require("path");
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

/*CONFIG EXPRESS*/

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res, next) => {
  res.render('index');
});


app.post('/artists',(req,res) => {

  spotifyApi.searchArtists(req.body.artists)
    .then(data => {
      const artista = {
        list : data.body.artists.items
      }
      res.render("artists", artista);
    })
    .catch(err => {
      console.log(`ERROR: ${err}`);
    })
   
}) 

app.get('/album/:id', (req, res, next) => {
  console.log(req.params.id)
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      const artist = {
        list: data.body.items
      };
       res.render('album', artist);
    })
    .catch(err => {
      console.log(`ERROR: ${err}`);
    })
});

const clientId = '8e506b89604a4c7ab787892320535a67',
    clientSecret = 'd5a6ae44be05446bacf2c3aba0d9d043';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});




const port = 3000;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));