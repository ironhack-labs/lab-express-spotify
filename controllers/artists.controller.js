const spotifyApi = require('../configs/spotify.config');

module.exports.artists = (req, res, next) => {
    
        spotifyApi.searchArtists(req.query.artists)  /**Le decimos de dónde debe coger la información (barra de búsqueda) */
        .then((data) => {
            const artist = data.body.artists.items;
            res.render('misc/artists-search', {artist});
        })
        .catch((error) => next(error));
}
