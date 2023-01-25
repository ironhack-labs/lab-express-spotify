const spotifyApi = require('../config/spotify.config');

module.exports.tracks = (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then(data => {
        res.render('tracks', { tracks: data.body.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
};


