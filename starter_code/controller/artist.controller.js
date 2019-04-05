const spotifyApi = require('../api')

module.exports.list = (req, res, next) => {
  const criteria = req.query.artist;
  spotifyApi.searchArtists(criteria)
    .then(data => {
      // console.log(data.body.artists.items)
      res.render('artist', {artists: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
}