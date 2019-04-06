const { app } = require(`../config`);
const {
  home,
  getArtists,
  getAlbumsByArtistId,
  getTracksByAlbumId
} = require(`./actions`);

app.get('/', home);
app.get('/artists', getArtists);
app.get('/albums/:artistId', getAlbumsByArtistId);
app.get('/tracks/:albumId', getTracksByAlbumId);

module.exports = app;