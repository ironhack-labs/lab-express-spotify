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

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.artista) //string digitada no campo Artista
        .then(data => {
            console.log('The received data from the API: ', JSON.stringify(data.body));
            console.log(data.body.artists.items[0].name);
            console.log(data.body.artists.items[0].images[0].url);
            const artistSearched = {
                lista: [],
            }
            for (let i = 0; i < data.body.artists.items.length; i++) {
                if (data.body.artists.items[i].images.length > 0) {
                    artistSearched.lista.push({
                        name: data.body.artists.items[i].name,
                        img: data.body.artists.items[i].images[0].url,
                        id: data.body.artists.items[i].id
                    })
                } else {
                    artistSearched.lista.push({
                        name: data.body.artists.items[i].name,
                        img: "https://data.pixiz.com/output/user/frame/preview/api/big/5/0/4/8/1968405_67bf5.jpg"
                    })
                }

            }
            res.render('artist-search-results', artistSearched) //parametros: para onde, o que se envia
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId) //string digitada no campo Artista
        .then(data => {
            console.log('The albums received data from the API: ', JSON.stringify(data.body));
            console.log(data.body.items[0].name);
            console.log(data.body.items[0].id);

            const albumsArtist = {
                disco: [],
            };
            for (let i = 0; i < data.body.items.length; i++) {
                if (data.body.items[i].images.length > 0) {
                    albumsArtist.disco.push({
                        name: data.body.items[i].name,
                        img: data.body.items[i].images[0].url,
                        id: data.body.items[i].id

                    })
                } else {
                    albumsArtist.disco.push({
                        name: data.body.items[i].name,
                        img: "https://data.pixiz.com/output/user/frame/preview/api/big/5/0/4/8/1968405_67bf5.jpg"
                    })
                }
            }
            res.render('albums', albumsArtist) //parametros: para onde, o que se envia
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('The tracks received data from the API: ', data.body);
            console.log(data.body.items[0].href);
            const allTracks = {
                tracks: []
            }

            for (let i = 0; i < data.body.items.length; i++) {
                allTracks.tracks.push({
                    name: data.body.items[i].name,
                    preview: data.body.items[i].preview_url,

                })
            }
            console.log(allTracks.tracks)
            res.render('tracks', allTracks)
        })
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
