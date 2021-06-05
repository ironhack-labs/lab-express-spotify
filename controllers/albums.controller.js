const SpotifyApi = require('../config/spotify.config')

// Our routes go here:
module.exports.albums = (req, res,next) => {
    res.render('albums/albums')
}


module.exports.getAlbums = (req, res, next) => {

    SpotifyApi
        .getArtistAlbums(req.params.id)
        .then((data) => {
            
            res.render('albums/albums', {albums: data.body.items})
        })
        .catch()
}
