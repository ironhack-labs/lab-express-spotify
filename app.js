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
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:

    //ROUTE FOR ARTIST SEARCH HOME PAGE
    app.get('/', (req, res) => {
        res.render('home', req.params);
      });



    //ROUTE FOR RESULTS PAGE
    app.get('/artist-search', (req,res) => {
        spotifyApi
            .searchArtists(req.query.artist)
            .then(data => {
                //deconstruct artist object
                const { name, images} = data.body.artists.items[0]
            // console.log('The received ARTISTS from the API: ', data.body.artists.items[0]);
            
            const artistIds = data.body.artists.items[0].id

            console.log('The received ARTISTS ID from the API: ', artistIds);

            //renders Artist name and Image onto artist-search-results
            res.render('artist-search-results', {name: name, image:images[0].url, artistIds:artistIds});
            })
  
        .catch(err => console.log('The error while searching ARTISTS occurred: ', err));
        console.log('---------------------------------');
    })


    // ROUTE FOR ALBUM PAGE
    app.get("/albums/:artistId", (req, res, next) => {
        spotifyApi
            .getArtistAlbums(req.params.artistId)
            .then((data) => {
            //console.log("this is the data:", data.body.items);
            
            res.render("albums", { album: data.body.items });
            })
            
        .catch((err) =>
        console.log("The error while searching artists occurred 4: ", err)
    );
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
