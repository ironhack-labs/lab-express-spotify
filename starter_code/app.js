require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/partials`);

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      // const musicians = data.body.artists;
      const item = data.body.artists.items;
      // console.log('The received data from the API: ', item);
      // res.send(item);
      res.render('artists', { item });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:musicianID', (req, res, next) => {
  const { musicianID } = req.params;
  spotifyApi.getArtistAlbums(musicianID).then(
    data => {
      const { items } = data.body;
      // console.log(`Artist's albums`, items);
      // console.log(items);
      // res.send(items);
      res.render('albums', { items });
    },
    // ? this is how the spotify api says to write the promise... no idea why? shouldn't it be .then( stuff ).catch(err => console.log(err) ) ??
    err => {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumID', (req, res, next) => {
  const { albumID } = req.params;
  spotifyApi.getAlbumTracks(albumID, { limit: 5, offset: 1 }).then(
    data => {
      const { items } = data.body;
      // console.log(items);
      // res.send(items);
      res.render('tracks', { items });
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
