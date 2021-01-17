const spotifyApi = require("../services/apiClient")

module.exports.list = (req, res, next) => {
    const { id } = req.params;
    spotifyApi.getAlbumTracks(id)
        .then(function(data) {
            console.log(data.body);
            res.render('tracks', {
                tracks: data.body
            })
        }, function(err) {
            console.log('Something went wrong!', err);
        });
}