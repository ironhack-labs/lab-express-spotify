const spotifyApi = require('../config/spotify.config')

module.exports.search = (req, res) => {
    spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
        res.render('search', { artists: data.body.artists.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}