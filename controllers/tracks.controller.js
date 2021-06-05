const SpotifyApi = require('../config/spotify.config')







module.exports.tracks = (req, res, next) => {

    res.render('tracks/tracks')
}

module.exports.doTracks = (req,res,next) =>  {

    SpotifyApi
          .searchTracks(req.query.id)
          .then((data) => {
            //res.send(data)
             res.render('tracks/tracks', {
              albums: data.body.tracks.items
            }) 
          })
       
               .catch(err => console.log('The error while searching artists occurred: ', 
               err));
    }
  