const spotifyApi = require("../configs/spotify.config")
// Retrieve an access token


module.exports.search = (req, res, next) => {
    const searchText = req.query.name
    spotifyApi
        .searchArtists(searchText)
        .then(data => {
            res.render('artist.hbs', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
}