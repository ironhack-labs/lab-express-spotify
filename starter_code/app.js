const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
// var spotifyApi = new SpotifyWebApi();
// Remember to insert your credentials here
const clientId = '5127c4060155423d90883aca1b4df0e7',
    clientSecret = '7e3b25e74e3e4c6fac2c6afe06253dc6';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    });


// the routes go here:

app.get('/', (req, res, next) => {
    //res.send('hello world');
    res.render("index.hbs");
    //res.render('index');
});
  
app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.q)
        .then(data => {
            let artistList = data.body.artists.items;
            res.render("artists.hbs", { artistList });
    })
    .catch(err => {
      console.log("The error while searching artists occurred:" , err);
    })
    
});
  
app.get('/albums/:artistId', (req, res, next) => {
    let artid = req.params.artistId;
    spotifyApi.getArtistAlbums(artid)
    .then(data => {
        let artistsAlb = data.body.items;
        res.render("artistsAlbum.hbs", { artistsAlb });
})
.catch(err => {
  console.log("The error while searching artists occurred:" , err);
})
 
});

app.get('/tracks/:albumid', (req, res, next) => {
    let albumid = req.params.albumid;
    spotifyApi.getAlbumTracks(albumid, { limit : 10, offset : 1 })
    .then(data => {
        let albumtracks = data.body.items;
        res.render("trackselection.hbs", { albumtracks });
})
.catch(err => {
  console.log("The error while searching artists occurred:" , err);
})
 
});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
