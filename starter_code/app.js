const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

const spotifyApi = new SpotifyWebApi({
    clientId: '85a3d842c8ef419189747849c02d4150',
    clientSecret: '567125b1a7af4341b0a73fab297de7c1'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })


// the routes go here:

app.get('/', (req, res) => {

    res.render('index', {

    });
});

app.get('/artists', (req, res) => {
    let name = req.query.name;
    spotifyApi.searchArtists(name)
        .then(data => {
            // res.send(`${data.body}`)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists', data)
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
});

app.get('/albums/:artistId', (req, res, next) => {
    let name = req.params.artistId
    // console.log(name)
    spotifyApi.getArtistAlbums(name).then(data => {
        console.log(name)
        console.log(data.body.items.name)
        // res.render('albums', data);
    })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
