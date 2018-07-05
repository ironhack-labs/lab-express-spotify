const port = 3000;
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyparser = require('body-parser')

const clientId = '4feb3058409047e6964332205d218817',
clientSecret = '55a2cb19583e464b89aed855f0b3f8a9';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/starter_code/views');

hbs.registerPartials(__dirname + '/starter_code/views/partials');

app.get('/', (req, res, next) => {
  res.render('home');
});

// data.body.artists.items


app.get('/artist', (req, res) => {
  searchArtist(req.query.artist)
  .then((artist)=>{
    const obj = artist.body.artists.items;
    res.render('artist', {obj});
  }).catch((err)=>{
    console.log(err);
  });
})


const searchArtist = (term)=>{
  return spotifyApi.searchArtists(term)
}
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(port, () => {
  console.log(`Ready http://localhost:${port}`)
})