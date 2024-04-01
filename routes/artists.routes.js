const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


router.get('/artist-search', (req, res) => {
    // Retrieve the search term from the query string
    const searchTerm = req.query.artist;
  
    // Make a search request using the Spotify npm package
    spotifyApi.searchArtists(searchTerm)
      .then(data => {
        // Extract relevant information from the received data
        const artists = data.body.artists.items.map(artist => ({
          id: artist.id,
          name: artist.name,
          image: artist.images.length > 0 ? artist.images[0].url : null // Get the first image if available
        }));
  
        // Render the artist-search-results view with the retrieved artists' information
        res.render('artist-search-results', { artists });
      })
      .catch(err => {
        console.error('Error while searching artists:', err);
        // Handle errors appropriately (e.g., render an error page)
        res.status(500).send('An error occurred while searching for artists.');
      });
  });
  


  module.exports = router;