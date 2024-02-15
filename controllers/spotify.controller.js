module.exports.home = (req, res, next) => res.render('home');

const spotifyApi = require('../configs/spotify.config');

module.exports.searchArtist = (req, res, next) => {
    const artist = req.query.name;
    if(!artist) {
        res.redirect('/')
    }

    spotifyApi.searchArtists(artist)
      .then((data) => {
        res.render('artists/artist-search-results', { artists: data.body })
      })
      .catch((error) => console.log('The error while searching artists occurred: ', error));
}

module.exports.getAlbums = (req, res, next) => {
  const artistId = req.params.artistId;
  
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      res.render('artists/albums', { albums: data.body.items})
    })
    .catch((error) => console.log('The error while searching albums occurred: ', error))
}

module.exports.searchTracks = (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
    .then((data) => {
      res.render('artists/tracks', {tracks: data.body.items})
    })
    .catch((error) => console.log('The error while searching tracks occurred: ', error))
}