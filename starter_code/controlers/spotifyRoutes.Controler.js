const SpotifyWebApi = require("spotify-web-api-node");
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const index = (req, res) => {
  res.render("index");
};

const artist = async (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", { data: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
};

const artistId = async (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render("albums", { data: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
};

const albumId = async (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render("sound", { data: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
};

module.exports = {
  index,
  artist,
  artistId,
  albumId
};
