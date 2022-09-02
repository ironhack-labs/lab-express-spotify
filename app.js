require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));  


// Our routes go here:

// just redering homepage for now
app.get('/', (req,res) => {
    res.render('index')
})

// Route for the search query
// address is of type http://localhost:3001/artist-search?artist=asd

app.get('/artist-search', (req,res) => {
    const searchedArtist = req.query.artist
    // access the request query - "?artist", and the key is "artist" as set in the button's name parameter in index.hbs 
    spotifyApi
    .searchArtists(searchedArtist)
    .then(data => {
        // res.json(data) RESPONDS WITH THE OBJECT JSONIFIED SO YOU CAN EXPLORE IT EASILY
        const albumsArray = data.body.artists.items;
        res.render('artist-search-results', {
            doctitle: `Search results for ${searchedArtist}`,
            albumsArray
        })
        console.log('The received data from the API: ', data.body.artists.items[0].images);
    })
    .catch(err => {
        console.log('Error while searching for artists occured:' + err)
    })

})





// START SERVER!!!
app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
