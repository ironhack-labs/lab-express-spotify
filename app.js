const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path')

//hbs
app.set('views', __dirname + '/views')
app.set('view engine','hbs')


hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'e64a13834b234da8aec60176b631ff7b',
    clientSecret = '0e4141b0e81942fcbe132b984cc297eb';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/search-songs/:id',(req,res)=>{
  spotifyApi.getAlbumTracks(req.params.id)
  .then(r=>{
    var arrObjSongsResult = r.body.items
    var arrObjSongsResultClean = []
    //res.send(arrObjSongsResult)

    for(var i=0;i<arrObjSongsResult.length;i++){
      //console.log('Name: '+ arrObjSongsResult[i].name)
      //console.log('Preview: '+arrObjSongsResult[i].preview_url)
      //console.log('ID: '+arrObjSongsResult[i].id)
      
        arrObjSongsResultClean.push({
          name:arrObjSongsResult[i].name,
          preview:arrObjSongsResult[i].preview_url,
          id:arrObjSongsResult[i].id
        })
        
      
    }
    res.render('songs', { arrObjSongsResultClean })
    //res.send(arrObjSongsResultClean)
  })
  .catch(err=>{

  })
})

app.get('/search-albums/:id', (req, res)=>{
  spotifyApi.getArtistAlbums(req.params.id)
  .then(r => {
    var arrObjAlbumsResult = r.body.items
    var arrObjAlbumsResultClean = []
    
    for(var i=0;i<arrObjAlbumsResult.length;i++){
      //console.log('Name: '+ arrObjAlbumsResult[i].name)
      if(arrObjAlbumsResult[i].images.length != 0){
        arrObjAlbumsResultClean.push({
          name:arrObjAlbumsResult[i].name,
          img:arrObjAlbumsResult[i].images[0].url,
          id:arrObjAlbumsResult[i].id
        })
      }
    }
    res.render('albums', { arrObjAlbumsResultClean })
  })
  .catch(err => {
    console.error('la cagaste',err)
  })   
  //res.send(req.params.id)
})



app.get('/search-artist', (req, res)=> {
    spotifyApi.searchArtists(req.query.artista)
    .then(r => {
      var arrObjResClean = []
      arr_ObjResult = r.body.artists.items
      //console.log('Artists information',r.body.artists.items)
      //res.send(r.body.artists.items)
      for(var i=0;i<arr_ObjResult.length;i++){
        if(arr_ObjResult[i].images.length != 0){
          arrObjResClean.push({
            name:arr_ObjResult[i].name,
            img:arr_ObjResult[i].images[0].url,
            id:arr_ObjResult[i].id
          })
        }
      }
      //console.log(arrObjResClean)
      res.render('results', { arrObjResClean })
      //res.redirect('/results')
      //res.send(arrObjResClean)
    })
    .catch(err => {
      console.error('la cagaste',err)
    })    

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))