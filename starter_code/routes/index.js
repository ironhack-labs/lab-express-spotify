const router = require('express').Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: '0db0fab0f556409aae67e2a96194b55d',
  clientSecret: '1f0cb2737f794a52b494cc921317eefa'
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/artists', (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artists = data.body.artists.items;
      res.render('artists', { artists });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

router.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      const albums = data.body.items;
      res.render('albums', { albums });
    },
    function(err) {
      console.log('The error while searching artists occurred: ', err);
    }
  );
});

router.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId).then(
    function(data) {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    },
    function(err) {
      console.log('The error while searching artists occurred: ', err);
    }
  );
});

module.exports = router;
