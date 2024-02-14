const spotifyApi = require('../configs/spotify.config')

module.exports.tracks = (req, res, next) => {
    const { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            //console.log('The received data from the API: ', data.body)
            const tracks = data.body.items
            res.render('albums/tracks', { tracks })
        })
        .catch(err => console.log('The error while searching tracks ocurred: ', err))
}