const spotifyApi = require("../config/spotifyApi.config")

module.exports.home = (req, res, next) => {
  res.render("home")
}

module.exports.artists = (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log("datita", data.body.artists.items)
      res.render("artist-search-results", { artists: data.body.artists.items, search: req.query.artist });
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.albums = (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => res.render("artist-albums", { albums: data.body.items }))
    .catch(next)
}

module.exports.tracks = (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      res.render("album-tracks", { tracks: data.body.items })
    })
    .catch(next)
}