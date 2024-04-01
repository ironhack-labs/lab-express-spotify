const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Create an instance of SpotifyWebApi
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Define the route for /albums/:artistId
router.get('/albums/:artistId', (req, res, next) => {
  // Extract the artist ID from the URL parameters
  const artistId = req.params.artistId;

  // Use the spotifyApi.getArtistAlbums() method to retrieve the albums of the specified artist
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      // Extract relevant information from the received data
      const albums = data.body.items.map(album => ({
        id: album.id,
        name: album.name,
        image: album.images.length > 0 ? album.images[0].url : null // Get the first image if available
      }));

      // Render the albums.hbs view with the retrieved albums' information
      res.render('albums', { albums });
    })
    .catch(err => {
      console.error('Error while fetching artist albums:', err);
      // Handle errors appropriately (e.g., render an error page)
      res.status(500).send('An error occurred while fetching artist albums.');
    });
});

app.get('/albums/:albumId/tracks', async (req, res, next) => {
    try {
      const albumId = req.params.albumId;
      const data = await spotifyApi.getAlbumTracks(albumId);
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    } catch (error) {
      console.error('Error fetching album tracks:', error);
      next(error);
    }
  });

// Export the router
module.exports = router;