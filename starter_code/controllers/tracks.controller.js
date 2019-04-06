const createError = require('http-errors');
const spotifyApi = require('../configs/db.config')

module.exports.list = (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.idAlbum)
        .then(data => {
          res.render('songs/tracks',{
            tracks: data.body.items,
          })
        })
        .catch(err => {
          console.log('The error while searching artists occurred: ', err);
        });
}
