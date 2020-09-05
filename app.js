require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:
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
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    console.log(req.query);

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const spotifyArray = data.body.artists.items;
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // const artistImages = artistArray.map

            const artistArray = spotifyArray.map(function (element) {
                return {
                    name: element.name,
                    image: element.images[0],
                    id: element.id
                };
            });

            console.log(artistArray);
            // [
            //     { name: 'brian eva', image: 'https://i.scdn.co/image/1047bf172446f2a815a99ab0a0395099d621be51' },
            //     { name: 'john henne', image: 'https://i.scdn.co/image/1047bf172446f2a815a99ab0a0395099d621be51' }
            //     ];
            res.render('artist-search-results', { artistArray });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi.getArtistAlbums(
        req.params.artistId, {
            limit: 10,
            offset: 20
        },
        
        function (err, data) {
            
            if (err) {
                console.error('Something went wrong!', err);
            } else {
                const spotifyAlbumsArray = data.body.items;

                const albumsArray = spotifyAlbumsArray.map(function (album) {
                    return {
                        name: album.name,
                        image: album.images[0],
                        id: album.id
                    };
                });
                console.log('THIS IS THE ALBUMS', albumsArray);
                res.render('albums', { albumsArray });
            }
            
        }
    );    
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));