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
        res.render('home');
      });



    //ROUTE FOR RESULTS PAGE
    app.get('/artist-search', (req,res) => {
        spotifyApi
            .searchArtists(req.query.artist)
            .then(data => {
                console.log('Received ARTIST data')

                //deconstruct artist object
                const { name, images, id} = data.body.artists.items[0]

            //renders Artist name, image and artistsIds onto artist-search-results
            res.render('artist-search-results', {name: name, image:images[1].url, artistIds:id});
            })
  
        .catch(err => console.log('Error while searching ARTISTS: ', err));
        console.log('---------------------------------');
    })


    // ROUTE FOR ALBUM PAGE
    app.get("/albums/:artistId", (req, res) => {
        spotifyApi
            .getArtistAlbums(req.params.artistId)
            .then(data => {
                console.log('Received ALBUM data')
                // console.log("This is the ALBUM data: ", data.body.items);
            
            // renders albumObj to albums page
            res.render("albums", { albumObj:data.body.items });
            })
            
            .catch(err => console.log('Error while searching Albums: ', err));
            console.log('---------------------------------');
        })


    //ROUTE FOR TRACKS PAGE
    app.get('/tracks/:albumId', (req, res) => {
        spotifyApi
            .getAlbumTracks(req.params.albumId)
            .then(data => {
                console.log('Received TRACK data')
                // console.log("This is the TRACK data: ", data.body.items);

            // renders trackObj to tracks page
            res.render("tracks", { trackObj:data.body.items })
            })

            .catch(err => console.log('Error while searching TRACKS: ', err));
            console.log('---------------------------------');
        })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
