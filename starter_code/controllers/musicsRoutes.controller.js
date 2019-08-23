// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '816e61355d5f4611812b62899793e365',
    clientSecret = 'f60fceb533cb4810b2b66c66a43be5ca';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

const index = (req, res, next) => {
  res.render('index');
}

const artistsRoute = async (req, res, next) => {
  const { artist } = req.body;
  try {
    const artists = await spotifyApi.searchArtists(artist);
    const arrayArtists = artists.body.artists.items
    res.render('artists-view', { arrayArtists });
  } catch(error) {
    console.log(error)
  }
}

const albumsRoute = async (req, res, next) => {
  const { artistId } = req.params;
  try {
    const albums = await spotifyApi.getArtistAlbums(artistId);
    const arrayAlbums = albums.body.items
    res.render('albums-view', { arrayAlbums });
  } catch(error) {
    console.log(error)
  }
}

const tracksRoute = async (req, res, next) => {
  const { albumId } = req.params;
  try {
    const tracks = await spotifyApi.getAlbumTracks(albumId);
    const arrayTracks = tracks.body.items
    console.log(arrayTracks)
    res.render('tracks-view', { arrayTracks });
  } catch(error) {
    console.log(error)
  }
}


module.exports = {
  artistsRoute,
  albumsRoute,
  tracksRoute,
  index,
}