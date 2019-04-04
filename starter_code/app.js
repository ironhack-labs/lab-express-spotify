const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

hbs.registerPartials(`${__dirname  }/views/partials`);
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

//spotify settings
const clientId = 'fb9dc24cfc014e4b9b0842ea98275de4';
const clientSecret = '2f44b0604e604c5eaad6e3372e3f853b';

const spotifyApi = new SpotifyWebApi({
  clientId:clientId,
  clientSecret:clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});


app.get('/artist', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.query.name)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artists', { data });
    }, (err) => {
      console.error(err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
