const router = require('express').Router();
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.API_CLIENT,
  clientSecret: process.env.API_KEY
});

router.get('/', (req, res) => {
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(e => console.log(e));
  res.render('search');
});

router.get('/tracks/:albumId', async (req, res) => {
  const {
    body: { items }
  } = await spotifyApi.getAlbumTracks(req.params.albumId);
  const {
    body: { name }
  } = await spotifyApi.getAlbum(req.params.albumId);
  res.render('tracks', { items, album: name });
});

router.get('/albums/:artistId', async (req, res) => {
  const {
    body: { items }
  } = await spotifyApi.getArtistAlbums(req.params.artistId);
  res.render('albums', { items });
});

router.get('/artists', async (req, res) => {
  const {
    body: {
      artists: { items }
    }
  } = await spotifyApi.searchArtists(req.query.artist);
  res.render('artists', { items });
  console.log(items);
});

module.exports = router;
