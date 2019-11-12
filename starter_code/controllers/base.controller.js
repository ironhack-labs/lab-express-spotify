const spotifyApi = require('../config/spotifyApi.config')

module.exports.base = (req, res, next) => {
  res.render ("index")
}

module.exports.getArtists = (req, res, next) => {
  console.log(req.query)

  spotifyApi.searchArtists(req.query.search)
    .then(data => {
      console.log(data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists",{ artists: data.body.artists.items })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

  
}

module.exports.getArtistAlbums = (req, res, next) =>{
  console.log(req.query)

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(
    function(data) {
      res.render("albums",{ albums: data.body.items })
  },
  function(err) {
    console.error("An error while searching for the albums occurred: ",err);
  }
);
}

module.exports.getAlbumTracks = (req, res, next) =>{
  console.log(req.query)

  spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    res.render("tracks",{tracks: data.body.items })
  }, function(err) {
    console.log('Something went wrong!', err);
  })
}



