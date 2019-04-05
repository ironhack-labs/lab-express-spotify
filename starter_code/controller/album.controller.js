const spotifyApi = require('../api')

module.exports.details = (req, res, next) => {
  const id = req.params.id;
  spotifyApi.getArtistAlbums(id)
    .then(data => {
      console.log(data.body.items)
      res.render('album', {albums : data.body.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

}