require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'pug');
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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(err => {
    console.log("Something went wrong when retrieving an access token", err);
  });

// the routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/artists', (req, res) => {
  let { artist } = req.body;
  //let { artists } = req.body.artists.items;
  console.log(req.body)
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let { items } = data.body.artists;
    // let { url } = data.body.artists.items.images
    //console.log("ESTO ES ITEMS PUTA MADRE ", items.name);
    console.log( 'This are the keys of Items:',Object.keys(items))
    //console.log(items[0].images[0].url)
    

    items.forEach( artist => {
      console.log(`This are the IMAGES for ${artist.name}`,artist.images)
      //console.log('This are the first URLs for every artist',artist.images[0].url)
      //let { images: image_url } = artist.images

      
      if ( artist.images.length < 1 ) artist.image = '/images/avatar.png'
      else artist.image = artist.images[0].url;
      //artist.image_url = JSON.parse(artist.image.url)
    });
    
    res.render('artists', {items})
    
    //res.send(items)

  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
  
})

app.get('/albums/:artistId', (req, res) => {

  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then( data => {
    console.log('Artist albums', data.body);
    let { items } = data.body;

    items.forEach( album => {
      //console.log(`This are the IMAGES for ${album.name}`,album.images)
      //console.log('This are the first URLs for every artist',artist.images[0].url)
      //let { images: image_url } = artist.images

      
      if ( album.images.length < 1 ) album.image = '/images/avatar.jpg'
      else album.image = album.images[0].url;
      //artist.image_url = JSON.parse(artist.image.url)
    });

    res.render('albums', {items} )

    //res.send(items)
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

});

app.get('/tracks/:albumId', (req, res) => {

  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then( data => {
    console.log('Album tracks', data.body);
    let { items } = data.body;

    res.render('tracks', {items} )

    //res.send(items)
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
