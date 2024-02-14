const spotifyApi = require('../configs/spotify.config')

module.exports.tracks = ('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
        res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) => {
        console.error("Error fetching tracks:", error);
    });
});