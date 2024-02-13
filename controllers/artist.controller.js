const spotifyApi = require('../configs/spotify.config');


module.exports.artist = (req, res, next) => {
    spotifyApi.searchArtists(req.query.search_field, { limit : 4 })
        .then((data) => {
            const artists = data.body.artists.items;
            res.render('misc/artist-search', { artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}
