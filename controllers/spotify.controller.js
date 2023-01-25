const spotifyApi = require("../config/spotify.config");

module.exports.home = (req, res) => {
  res.render('index');
};

module.exports.search = (req, res) => {
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search', { artists: data.body.artists.items });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
};

module.exports.albums = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      res.render('artist-albums', {albums: data.body.items})
    })
    .catch(err => console.log('The error while searching the artists albums occurred: ', err));
};

module.exports.tracks = (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    res.render('tracks', {tracks: data.body.items})
  })
  .catch(err => console.log('The error while searching the albums tracks occurred: ', err));
};