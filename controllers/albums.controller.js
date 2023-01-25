const spotifyApi = require('../config/spotify.config')

module.exports.albums = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      res.render('albums', { albums: data.body.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}