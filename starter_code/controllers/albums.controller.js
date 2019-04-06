const createError = require('http-errors');
const spotifyApi = require('../configs/db.config')

module.exports.albums = (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
        .then(data => {
          res.render('songs/albums',{
            albums: data.body.items,
          })
        })
        .catch(err => {
          console.log('The error while searching artists occurred: ', err);
        });
}
