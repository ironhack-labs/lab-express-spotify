const SpotifyWebApi = require('spotify-web-api-node');
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
  





exports.readTrack = (req, res) => {

    console.log(req.params.tracks)//ID de los tracks

    // BUSCAR EN BASE DE DATOS SI EXISTE UN DATO DEL REQ.PARAMS


    // RESPUESTA

  
    spotifyApi.getAlbumTracks(`${req.params.tracks}`, { limit : 10, offset : 1 })
    .then((data)=>{
        //Acceder a todos los albums de la banda
        let tracks=data.body.items
    

        console.log(tracks)
        
        res.render("tracks",{
            tracks:tracks
        })
        
       
    });


}