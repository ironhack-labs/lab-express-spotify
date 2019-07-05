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
const clientId = 'd546a5b903e6437c872f54ec262bc57c';
const clientSecret = '35ab81ff3e1e46978683282a08253d82';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
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
  res.render('home');
});

app.get('/artists', (req, res, next) => {
  const { artist } = req.query;
  spotifyApi.searchArtists(artist)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists);
      const items = data.body.artists;
      res.render('artists', items);
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      console.log('Artist albums', data.body);
      res.render('albums', data.body)
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  const {albumId} = req.params;
  spotifyApi.getAlbumTracks(albumId)
    .then((data) =>{
      console.log('Tracks', data.body);
      res.render('tracks', data.body)
    })
    .catch((err) => {
      console.error(err);
    });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
