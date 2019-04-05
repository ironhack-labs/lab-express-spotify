const spotifyApi = require('../api')

module.exports.list = (req, res, next) => {
  const criteria = req.params.id;
  spotifyApi.getAlbumTracks(criteria)
    .then(data => {
      console.log(data.body.items)
      res.render('tracks', {tracks: data.body.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
}