require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });  

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index', {bkg_image_class: "index-body"});
});

app.get('/artists', (req, res, next) => {

  spotifyApi
    .searchArtists(req.query.artist_name)
    .then(data => {

      let artist_items = data.body.artists.items.map( artist_item => {
          return {
                    name: artist_item.name,
                    image: (artist_item.images.length === 0 ?
                              { url: "/images/no_image.png",  width: "320",  height: "320" }
                                :
                              { url: artist_item.images[0].url,
                                width: 320, //artist_item.images[0].width/2,
                                height: 320 //artist_item.images[0].height/2
                              }
                            ),
                    ref_page: "albums",
                    ref_id: artist_item.id,
                    info_type: "Albums"
                }; 
          });
      res.render( "artists", { items: artist_items, bkg_image_class: "index-body" } );
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});


app.get('/albums/:id', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      let album_items = data.body.items.map( album_item => {
          return {
                    artist: album_item.artists[0].name,
                    name: album_item.name,
                    image: (album_item.images.length === 0 ?
                              { url: "/images/no_image.png",  width: "320",  height: "320" }
                                :
                              { url: album_item.images[0].url,
                                width: 320, //artist_item.images[0].width/2,
                                height: 320 //artist_item.images[0].height/2
                              }
                            ),
                    ref_page: "tracks",
                    ref_id: album_item.id,
                    info_type: "Tracks"
                }; 
          });
      res.render( "albums",{ items: album_items, artist: album_items[0].artist, bkg_image_class: "index-body" } );
    })
    .catch(err => {
      console.log('The error while searching album occurred: ', err);
    });
});

app.get('/tracks/:id', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      let track_items = data.body.items.map( track_item => {
          return {
                    name: track_item.name,
                    url: track_item.preview_url
                }; 
          });
      res.render( "tracks",{ items: track_items, bkg_image_class: "index-body" } );
    })
    .catch(err => {
      console.log('The error while searching tracks occurred: ', err);
    });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
