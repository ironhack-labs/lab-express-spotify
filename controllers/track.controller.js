const spotifyApi = require('../configs/routes.config')

module.exports.tracks = (req, res, next) => {
    const albumId = req.params.artistId;
    //const search = req.query;

    spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
        res.render("album/tracks", { tracks: data.body.items });
    })
    .catch((error) => {
        console.error("Error fetching tracks:", error);
    });
};