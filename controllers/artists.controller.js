const spotifyApi = require('../configs/spotify.config');

module.exports.list = (req, res, next) => {
    const artist = req.query.search;

    if (!artist) res.redirect('/');

    spotifyApi.searchArtists(artist)
        .then((data) => {
            //console.log('The received data from the API: ', data.body);
            const artists = data.body.artists.items;
            res.render('artists/artist-search-result', { artists });
        })
        .catch((err) => {
            console.error('The error while searching artists occurred: ', err);
            next(err);
        })
}