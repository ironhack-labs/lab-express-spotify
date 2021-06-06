const SpotifyApi = require('../config/spotify.config')




module.exports.tracks = (req, res, next) => {

    res.render('tracks/tracks')
}

module.exports.getTracks = (req,res,next) =>  {

  SpotifyApi
    .getAlbumTracks(req.params.id)
     .then((data) => {
        //res.send(data)
        res.render('tracks/tracks', {tracks: data.body.items}) 
        
      })
       
      .catch(err => console.log('The error while searching artists occurred: ', 
       err));
    }
  