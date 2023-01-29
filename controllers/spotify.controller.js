const spotifyApi = require('../config/spotify.config')

module.exports.home = (req, res) => {
  res.render('home')
}

module.exports.searchArtist = (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render('artist', { artists: data.body.artists.items })
    })
    .catch(err => console.error('The error while searching artists occurred: ', err))
}

module.exports.getAlbums = (req, res) => {
  spotifyApi 
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render('album', { albums: data.body.items })
  })
  .catch(err => console.error('The error while searching albums occurred: ', err))
}

module.exports.getTracks = (req, res) => {
  spotifyApi 
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    res.render('track', { tracks: data.body.items })
  })
  .catch(err => console.error('The error while searching albums occurred: ', err))
}