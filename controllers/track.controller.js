const spotifyApi = require('../configs/spotify.config');

module.exports.tracks = (req, res, next) => {
    const { albumId } = req.params;
    const { search } = req.query;
    spotifyApi.getAlbumTracks(albumId, { limit : 8 })
        .then(function(data) {
            res.render('misc/tracks', {tracks: data.body.items, search: search});
        })
        .catch(err => console.log('The error while searching the tracks occurred: ', err));
};