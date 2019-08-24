// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = process.env.CLIENTID,
    clientSecret = process.env.CLIENTSECRET;

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
    res.render('artists-view', artists.body.artists );
  } catch(error) {
    console.log(error)
  }
}

const albumsRoute = async (req, res, next) => {
  const { artistId } = req.params;
  try {
    const albums = await spotifyApi.getArtistAlbums(artistId);
    res.render('albums-view', albums.body );
  } catch(error) {
    console.log(error)
  }
}

const tracksRoute = async (req, res, next) => {
  const { albumId } = req.params;
  try {
    const tracks = await spotifyApi.getAlbumTracks(albumId);
    res.render('tracks-view', tracks.body );
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