const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

module.exports.searchArtists = (searchField) =>
  spotifyApi.searchArtists(searchField);

module.exports.getArtistAlbums = (artistId) =>
  spotifyApi.getArtistAlbums(artistId);

module.exports.getAlbumTracks = (albumId) => spotifyApi.getAlbumTracks(albumId);
