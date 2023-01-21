
const spotifyAPI = require('../config/spotify.config')

module.exports.home = (req, res, next) => {
  res.render('home')
}

module.exports.search = (req, res, next) => {
  // console.log(req.query)
  spotifyAPI
    .searchArtists(req.query.search)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', {
        artists: data.body.artists.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.albums = (req, res, next) => {
  spotifyAPI.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.render('artist-albums', {
      albums: data.body.items
    })
  }, function(err) {
    console.error(err);
  });
}

