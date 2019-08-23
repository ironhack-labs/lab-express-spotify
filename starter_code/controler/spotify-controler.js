const SpotifyApi = require('spotify-web-api-node');

const clientId = '8f89e65c1d11493dad7882a3c7c8060e';
const clientSecret = '548a0416724642c59f1827faad2bcd17';
const spotifyApi = new SpotifyApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });

const index = (req, res) => {
  res.render('index');
};

const artists = async (req, res) => {
  try {
    const allArtists = await spotifyApi.searchArtists(req.body.artist);
    const data = allArtists.body.artists.items;
    res.render('artists', { allArtists: data });
  } catch (err) {
    console.log(err);
  }  
};

const albums = async (req, res) => {
  try {
    const allAlbums = await spotifyApi.getArtistAlbums(req.query.id);
    const dataAlbums = allAlbums.body.items;
    res.render('albums', { allAlbums: dataAlbums });
  } catch (err) {
    console.log(err);
  }
};

const tracks = async (req, res) => {
  try {
    const allTracks = await spotifyApi.getAlbumTracks(req.query.id);
    console.log(allTracks.body.items[0]);
    const dataTracks = allTracks.body.items;
    res.render('tracks', { allTracks: dataTracks });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
  artists,
  albums,
  tracks,
};
