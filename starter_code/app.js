const PORT = 3000;
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const spotifyApi = require('./configs/spotify.config');

app.use(express.static(path.join(__dirname,'/public')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.get('/', (req,res, next)=>{
    res.render('home');
});

//artists
app.get('/artists', (req,res, next)=>{  
    var artist = req.query.queryArtist;
    
    spotifyApi.searchArtists(artist)
    
    .then(data => {   
        
        var elements = data.body.artists.items;   
        res.render('artists', { data:elements});
    })
    .catch(err => next(err));  
});

//songs
app.get('/songs', (req,res, next)=>{  
    var song = req.query.querySong;
    
    spotifyApi.searchTracks(song)
    
    .then(data => {   
        
        var elements = data.body.tracks.items;                    
        res.render('songs', {data: elements});
    })
    .catch(err => next(err));
    
});

//albums
app.get('/albums/:artistId', (req, res, next)=>{
    
    var artistId = req.params.artistId;
    
    spotifyApi.getArtistAlbums(artistId)
    .then(data =>{
        
        var elements = data.body.items;
        // console.log(elements);
        
        res.render('albums', { data: elements});
    })
    .catch(err => next(err));
    
});

//tracks
app.get('/tracks/:albumId', (req, res, next)=>{
    
    var albumId = req.params.albumId;
    
    spotifyApi.getAlbumTracks(albumId)
    .then(data =>{
        
        var elements = data.body.items;    
        console.log(elements);
        
        res.render('tracks', { data: elements});
    })
    .catch(err => next(err));
    
});

app.listen(PORT, ()=> console.log(`running on port ${PORT}`));
