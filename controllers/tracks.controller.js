const spotifyService = require("../services/spotify.service");

module.exports.tracks = (req, res, next) => {
  console.log(req);
  spotifyService
    .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then((data) => {
      console.log("Albums tracks", data.body);
      res.render("tracks/tracks", { tracks: data.body.items });
    })
    .catch((err) => {
      console.log("The error while searching albums occurred: ", err);
      return next(err);
    });
};
