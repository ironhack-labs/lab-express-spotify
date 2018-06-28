const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

hbs.registerPartials(__dirname + '/views');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId : '73dec2c2865b45be94931dfcc9fd5d75',
  clientSecret : 'fbd37786f28147c9a15597ee1c95687e'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {    
    res.render('index');    
});

app.get('/artists', (req, res) => {
    const artist = req.query.artist;

    spotifyApi.searchArtists(artist)
    .then(data => {
            //console.log(data.body.artists.items);
            res.render('artists', {
                artists: data.body.artists.items
            });
        });
});

app.get(`/albums/:artistid`, (req, res) => {
    const artistid = req.params.artistid;
/*     res.send(artistid)
 */
    spotifyApi.getArtistAlbums(artistid)
        .then(data => {
            //console.log('Artist albums', data.body.items);
            res.render('albums', {
                albums: data.body.items
            })
        })
        .catch(err => {
            console.error(err);
        })
});

app.get('/tracks/:albumid', (req,res) => {
    const albumid = req.params.albumid;

    spotifyApi.getAlbumTracks(albumid)
        .then(data => {
            //console.log(data.body);
             res.render('tracks', {
                tracks: data.body.items
            }) 
        })
        .catch(err => {
            console.error(err);
        })
});



app.listen(3000, () => console.log('ready'));