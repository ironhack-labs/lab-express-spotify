const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/partials`);


// setting the spotify-api goes here:
const clientId = 'c5a00d99bb284c45a3251dbc90189608';
const clientSecret = '4a19b03fee0c4cab9d399a1ec47db08a';
const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
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

app.get('/artists', (req, res, next) => {
  const { name } = req.query;
  spotifyApi.searchArtists(name)
    .then((data) => {
      res.render('artists', { name: data.body.artists.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      res.render('albums', { albuns: data.body.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId/:track', (req, res, next) => {
  const { track } = req.params;
  spotifyApi.getAlbumTracks(track)
    .then((data) => {
      console.log(data.body);
      res.render('track', { track: data.body.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
