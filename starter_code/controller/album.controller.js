const spotifyApi = require('../api')

module.exports.details = (req, res, next) => {
  const id = req.params.id;
  // spotifyApi.searchArtists(criteria)
  //   .then(data => {
  //     res.render('artist', {artists: data.body.artists.items})
  //   })
  //   .catch(err => {
  //     console.log("The error while searching artists occurred: ", err);
  //   })
  res.render('album', {id})
}