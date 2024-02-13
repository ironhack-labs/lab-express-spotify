const spotifyService = require("../services/spotify.service");

module.exports.list = (req, res, next) => {
  if (req.query.search_field)
    spotifyService
      .searchArtists(req.query.search_field)
      .then((data) => {
        const artists = data.body.artists.items;
        res.render("artists/artist-search-results", { artists });
      })
      .catch((err) => {
        console.log("The error while searching artists occurred: ", err);
        return next(err);
      });
  else res.render("artists/artist-search-results", { artists: [] });
};
