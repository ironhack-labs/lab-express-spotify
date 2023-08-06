require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// Set up view engine
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Routes
app.get('/', (req, res) => {
    res.render('home', { pageTitle: 'Home', layout: 'layout' });
});

app.get('/artist-search', (req, res) => {
    const artistName = req.query.artist;

    spotifyApi.searchArtists(artistName)
        .then(data => {
            const artists = data.body.artists;
            res.render('artist-search-results', { artists, pageTitle: 'Artist Search Results', layout: 'layout' });
        })
        .catch(err => console.log('Error searching artists: ', err));
});

app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            const artist = data.body.items[0].artists[0];
            const albums = data.body;
            res.render('albums', { artist, albums, pageTitle: 'Albums', layout: 'layout' });
        })
        .catch(err => console.log('Error fetching artist albums: ', err));
});

app.get('/tracks/:albumId', async (req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const { body: { items: tracks } } = await spotifyApi.getAlbumTracks(albumId);
        console.log(tracks);

        res.render('track-information', { tracks });
    } catch (error) {
        console.error(error);
        next(error);
    }


});


// Start the server
app.listen(3000, () => {
    console.log("My Spotify project running on port 3000 :headphones: :drum_with_drumsticks: :guitar: :loud_sound:");
});
