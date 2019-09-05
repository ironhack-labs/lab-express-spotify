const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

//spotify Credentials ----- should go on the .env file
const clientId = 'd90530cf218e4140ba990c792af537fe',
    clientSecret = '8e84115009964374ba26afad8ccc2f8d';

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


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//Routes
app.get("/", (req, res, next) => {
    res.render("index");
  });

  //get artists from search result route
  app.get("/artists", (req,res,next) => {
    const searchResult = req.query.search;
    console.log("Search result:", searchResult)

    spotifyApi
    .searchArtists(searchResult)
    .then(artistsFromApi => {
    //   console.log(
    //     "The received data from the API: ",
    //     artistsFromApi.body.artists.items[0]
    //   );
    const data = {
        search: searchResult,
        artists: artistsFromApi.body.artists.items
    }
      res.render("artists", data);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  })
// GET albums from specific artist route

  app.get("/albums/:artistId", (req, res, next) => {
    //retrieve Id from the URL and use it in the pre-defined method from the API to get all albums
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(albumsFromApi => {
            // store the output from Api in a variable
            const albums = albumsFromApi.body.items;
            //need to retrieve the information from artist again because it is a different route
        spotifyApi.getArtist(req.params.artistId)
         .then(artistsFromApi => {
            const data = {
                albums: albums,
                artistName: artistsFromApi.body.name
        };
        res.render("list-albums", data);
      });
    });
  });

// GET tracks route
  app.get("/tracks/:trackId", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.trackId)
    .then(tracksFromApi => {
        const data = {
            tracks:  tracksFromApi.body.items
        }
      // console.log("Tracks", data.body.items);
      res.render("list-tracks",data);
    });
  });





app.listen(3000, () => 
console.log("My Spotify project running on http://localhost:3000 🎧 🥁 🎸 🔊"));
