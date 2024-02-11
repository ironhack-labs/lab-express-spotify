const spotifyApi = require('../configs/spotify.config');


module.exports.artist = (req, res, next) => {
    res.render('misc/artist-search')
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            console.log((`Search artists by ${req.query.artist}`), data.body);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}
