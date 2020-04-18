require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const bodyParser = require('body-parser')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search-results',(req,res)=> {
    console.log('artist-search-results route was created')
})

app.get('/artist-search', (req, res, next) => {
    console.log(req.query.artname) // --> { artname: 'placebo' } if in the form I type "placebo" and submit the form
    spotifyApi
  .searchArtists(req.query.artname)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    console.log('One of the items of the data: ', data.body.artists.items[0]);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // app.get('/artist-search-results', (req, res) => {
        //! CAN WE CREATE A ROUTE INSIDE OF ANOTHER ROUTE??? , maybe not and that is why I couldn't access artist-search-results
    //     res.send('this route is just to  ...');
    //   })
    // app.post('/artist-search-results', (req, res) => {
    //      // if we want to make post requests we have to have body-parser installed
    //     // res.render('artist-search-results', { artists: data });
    //   //  let name = req.body.name;
    //     console.log('The name is:', name)
    //     // let image= req.body.images.url
    //      // res.render('artist-search-results', { name });

    //      // VER COMENTARIOS DO ANDRE NO SLACK. txt no desktop
    //   });
    let artists = data.body.artists.items
    console.log('sending data to artist-search results')
    res.render('artist-search-results',{ artists }  )

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  console.log(req.params.id)
  spotifyApi
  .getArtistAlbums(req.params.id)
    .then(data => {
    console.log('The received data from the API: ', data.body);
    // console.log('One of the items of the data: ', data.body.artists.items[0])});
});
})



app.listen(3000, () => console.log('My Spotify project running on port 3000'));