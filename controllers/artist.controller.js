const spotifyApi = require('../config/spotify.config');

module.exports.artistController = (req, res, next) => {
    spotifyApi.searchArtists(req.query.search_fill, {limit: 6})
        .then(data => {
            const artists = data.body.artists.items;
            res.render('pages/artists-search-result', { artists });
            
        })
        .catch(error => console.error('The error while searching artists has occurred: ', error));
};