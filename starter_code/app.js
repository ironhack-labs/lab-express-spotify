const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname }/views`);
app.use(express.static(`${__dirname}/public`));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '82cb2fefc82f4b32bbd2bfc3410b9a4b';
const clientSecret = 'c872988000df4a78947e601b25f936e3';

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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  const { artists } = req.query;
  spotifyApi.searchArtists(artists)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let elem = data.body.artists.items;
      console.log('The received data from the API: ', elem);
      res.render('artists', { elem });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:id', (req, res) => {
  const artistAlbum = req.params.id;
  spotifyApi.getArtistAlbums(artistAlbum)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const elem1 = data.body.items;
      console.log('The received data from the API: ', elem1);
      res.render('album', { elem1 });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/tracks/:id', (req, res) => {
  const artistTracks = req.params.id;
  console.log(artistTracks);
  spotifyApi.getAlbumTracks(artistTracks)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const elem1 = data.body.items;
      console.log('The received data from the API: ', elem1);
      res.render('tracks', { elem1 });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
