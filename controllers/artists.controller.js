const spotifyApi = require('../services/apiClient');

module.exports.list = (req, res, next) => {
    const { artist } = req.query;
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            res.render('artist-search-results', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};