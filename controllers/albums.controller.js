const spotifyApi = require('../configs/spotify.config')

module.exports.albums = (req, res, next) => {
    const { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            //console.log('The received data from the API: ', data.body)
            const albums = data.body.items
            res.render('albums/albums', { albums })
        })
        .catch(err => console.log('The error while searching albums ocurred: ', err))
}