const spotifyApi = require('../services/apiClient');

module.exports.list = (req, res, next) => {
    const { id } = req.params;
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            res.render('albums', {albums: data.body});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}