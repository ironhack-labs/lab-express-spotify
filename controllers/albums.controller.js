const spotifyApi = require('../configs/api.config');

module.exports.albums = (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then((data) => {
        const albums = data.body.items;
        console.log('The received data from the API: ', albums);
        res.render("albums", {albums})
    })
    .catch((err) => console.log('The error while searching albums occurred: ', err))
}