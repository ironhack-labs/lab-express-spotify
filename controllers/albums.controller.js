const spotifyService = require("../services/spotify.service");

module.exports.albums = (req, res, next) => {
  spotifyService
    .getArtistAlbums(req.params.id)
    .then((data) => {
      res.render("albums/albums", { albums: data.body.items });
    })
    .catch((err) => {
      console.log("The error while searching albums occurred: ", err);
      return next(err);
    });
};
