const spotifyApi = require('../configs/spotify.config');

module.exports.list = (req, res, next) => {
    const { id } = req.params;

    spotifyApi.getArtistAlbums(id)
        .then((data) => {
            //console.log('The received data from the API: ', data.body);
            const albums = data.body.items;
            res.render('albums/albums', { albums });
        })
        .catch((err) => {
            console.error('The error while searching albums occurred: ', err);
            next(err);
        })
}