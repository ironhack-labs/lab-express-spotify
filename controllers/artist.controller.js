const spotifyApi = require('../configs/spotify.config')


module.exports.artist = (req, res, next) => {
    const { artist } = req.query
    if (!artist) {
        res.redirect('/')
    }
    spotifyApi
        .searchArtists(artist)
        .then(data => {
        console.log('The received data from the API: ', data.body)
        const result = data.body.artists.items
        res.render('artist/artist-search-result', { result })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
}