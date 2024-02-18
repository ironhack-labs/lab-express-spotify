const spotifyApi = require('../configs/api.config');

module.exports.tracks = (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then((data) => {
        const tracks = data.body.items;
        console.log('The received data from the API: ', tracks);
        res.render("tracks", {tracks})
    })
    .catch((err) => console.log('The error while searching tracks occurred: ', err))
}
