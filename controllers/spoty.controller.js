onst spotifyApi = require("../config/spoti.config");

// '/'
module.exports.renderHome = (req, res, next) => {
  res.render("index");
};

// '/search-artist'
module.exports.searchArtist = (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artists/artist-search-results", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
};

// '/albums'
module.exports.getAlbums = (req, res, next) => {
  const { artistId } = req.params;
  const { artist } = req.query;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log(data);
      res.render("albums/albums", {albums: data.body.items, artist: artist});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
};

module.exports.getAlbumTracks = (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      console.log(data.body.items);
      res.render('albums/albumTracks', { tracks: data.body.items });
    })
    .catch(err => console.log('The error while searching artist albums occurred: ', err))
}