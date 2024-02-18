const spotifyApi = require('../config/spotify.config');

module.exports.list = (req, res, next) => {
    const { id } = req.params;
    res.render('pages/albums');
    spotifyApi.getArtistAlbums(id)
        .then(data => {
            res.render('pages/albums', data.body.items);
            console.log('The received data from the API: ', data.body);
        })
        .catch(error => console.error('The error while searching albums occurred: ', error));
};