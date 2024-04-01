const express = require('express');
const router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Define the route for the home page
router.get('/', (req, res) => {
  // Render the home page view
  res.render('index');
});

// Export the router
module.exports = router;

