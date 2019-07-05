const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partial')

const clientId = 'fe8de72155b34021a7bb052999c8cf59',
    clientSecret = '54a98a43ea83466db4c35ecaef5bb512';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// setting the spotify-api goes here:





// the routes go here:
app.get('/',(req,res)=>{
    res.render('index');
});


app.get("/artists", (req, res, next)=>{
    console.log(req.query);
    {x: 'red hot chili peppers'
    album: 'stadium arcadiam'
}
    spotifyApi.searchArtists(req.query.x)
    .then(data => {
        res.render('artists',data.body.artists)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})

app.get('/albums/:artistId', (req, res, next) => {
    
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log(data);
        res.render('albums',data.body)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
    // .getArtistAlbums() code goes here
  });


  app.get('/tracks/:trackId', (req, res, next) => {
    
    spotifyApi.getAlbumTracks(req.params.trackId)
    .then(data => {
        console.log(data);
        res.render('tracks',data.body)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
    // .getArtistAlbums() code goes here
  });


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
