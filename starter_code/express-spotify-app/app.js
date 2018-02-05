var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Remember to paste here your credentials
var clientId = 'a8dcedef37674b7eafa81dbf84dc442d',
    clientSecret = 'caf8966eb3034ca5947ca0809387f04b';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});
app.use(express.static(__dirname + 'public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.get('/', (req, res, next) => {
    res.render('index');

});
app.get('/artists', (req, res, next) => {
    let searchTerm = req.query.artist;
    
    
    spotifyApi.searchArtists(searchTerm)
        .then(function (response) {
            let vodi = response.body.artists;
            let artistas = { artists: vodi.items }
            console.log(artistas.artists[0].images[0].url)
        res.render('artists',  { artists:vodi.items} )
        
    }, function (err) {
        console.error(err);
    });
    
    // console.log("The searchTerm is " + searchTerm);
    //console.log(vodi);
    //res.render('artists', {  : vodi })
});


app.listen(3000, () => {
    console.log('My first app listening on port 3000!');
});
            // app.post('/artists', (req, res, next) => {
            
            
            //     let searchTerm = req.query.artist;
            //     res.render("artists", searchTerm);
            //     // // console.log(`artists:'${cat}`);
            
            //         console.log(searchTerm)
            //     // console.log({cat: artista})
            //     //res.render('artists', );
            // res.redirect(`/artists?cat=${searchTerm}`);
            // })