const spotifyApi = require('../configs/spotify.config');

module.exports.list = (req, res, next) => {
    const { id } = req.params;

    spotifyApi.getAlbumTracks(id)
        .then((data) => {
            //console.log('The received data from the API: ', data.body);
            const tracks = data.body.items;
            res.render('tracks/tracks', { tracks });
        })
        .catch((err) => {
            console.error('The error while searching tracks occurred: ', err);
            next(err);
        })
    }