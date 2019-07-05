const express = require('express');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname }/views`);
app.use(express.static(`${__dirname }/public`));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '';
const clientSecret = '';

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
  spotifyApi.searchArtists(artistSearch.artist)
    .then((data) => {
      const theArtist = data.body.artists.items;
      res.render('artists', { theArtist });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  const artID = req.params.artistId;
  spotifyApi.getArtistAlbums(artID)
    .then((data) => {;
      const theAlbums = data.body.items;
      res.render('albums', { theAlbums });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/albumtracks/:albumId', (req, res, next) => {
  const albID = req.params.albumId;
  spotifyApi.getAlbumTracks(albID)
    .then((data) => {
      const theTracks = data.body.items;
      res.render('albumtracks', { theTracks });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
