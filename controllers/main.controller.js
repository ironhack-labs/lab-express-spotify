const spotifyApi = require('../config/spotifySetup');

module.exports.renderHome = (req, res, next) => {
  res.render('home');
}

module.exports.getArtistsSearch = (req, res, next) => {
  const { artist } = req.query;

  if (!artist) {
    res.redirect('/');
  }

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);

      console.log(data.body.artists.items[0]);

      res.render('artists/artistsSearch', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.getAlbums = (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {

      res.render('albums/albums', { albums: data.body.items });
    })
    .catch(err => console.log('The error while searching artist albums occurred: ', err))

}

module.exports.getAlbumTracks = (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      res.render('albums/albumTracks', { tracks: data.body.items });
    })
    .catch(err => console.log('The error while searching artist albums occurred: ', err))
}