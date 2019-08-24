const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'ff6925f48fde4e83948fd74459646cf4';
const clientSecret = '030ed8be6d394583b7f16167333166a0';

const spotifyApi = new SpotifyWebApi({ clientId, clientSecret });

spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

const index = (req, res) => {
  res.render('index');
};

const searchArtistByName = async (req, res) => {
  const { name } = req.query;
  try {
    const artistsFound = await spotifyApi.searchArtists(name);
    const artistsArray = artistsFound.body.artists.items;
    res.render('artists', { artistsArray });
    // res.render('artists', artistsObject);
  } catch (err) {
    console.log('An error ocurred while searching for artists: ', err);
  }
};

const searchArtistAlbums = async (req, res) => {
  const { artistId } = req.params;
  try {
    const albums = await spotifyApi.getArtistAlbums(artistId);
    const albumsArray = albums.body.items;
    res.render('albums', { albumsArray });
  } catch (err) {
    console.log('An error ocurred while searching for the albums: ', err);
  }
};

const searchAlbumTracks = async (req, res) => {
  const { albumId } = req.params;
  try {
    const tracks = await spotifyApi.getAlbumTracks(albumId);
    const tracksArray = tracks.body.items;
    res.render('tracks', { tracksArray });
  } catch (err) {
    console.log('An error ocurred while searching for the tracks: ', err);
  }
};

module.exports = {
  index,
  searchArtistByName,
  searchArtistAlbums,
  searchAlbumTracks,
};
