const spotifyApi = require('../configs/api.config');

module.exports.artists = (req, res, next) => {
    spotifyApi.searchArtists(req.query.search_field, { limit: 10, offset: 20 })
    .then((data) => {
        const artists = data.body.artists.items;
        console.log('The received data from the API: ', artists);
        res.render('artist-search-results', {artists})
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err))
}