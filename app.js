const SpotifyWebApi = require('spotify-web-api-node');

const spotify = new SpotifyWebApi();

spotify.searchArtists('The Beatles', {}, (err, data) => {
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists);
});
