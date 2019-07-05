const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname }/views`);
app.use(express.static(`${__dirname }/public`));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '630ac730472041338a0abb359b2add7b';
const clientSecret = '5102723cca354668b0f67fef1a9183ac';

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
  const artistSearch = req.query;
  console.log(artistSearch.artist);
  spotifyApi.searchArtists(artistSearch.artist)
    .then((data) => {
      const theArtist = data.body.artists.items;
      // console.log('The received data from the API: ', theArtist);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', { theArtist });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  const artID = req.params.artistId;
  console.log(artID);
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(artID)
    .then((data) => {
      // console.log('Artist albums', data.body);
      const theAlbums = data.body.items;
      res.render('albums', { theAlbums });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/albumtracks/:albumId', (req, res, next) => {
  const albID = req.params.albumId;
  console.log(albID);
  // .getArtistAlbums() code goes here
  spotifyApi.getAlbumTracks(albID)
    .then((data) => {
      console.log('Album tracks', data.body);
      const theTracks = data.body.items;
      res.render('albumtracks', { theTracks });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
