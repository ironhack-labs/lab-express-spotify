//1.- importaciones
const express = require('express')
const hbs = require('hbs')
//const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');
//variables
const port = 3000
const clientId = '1e891f337f9d4122b9aa39e0dda12d92', clientSecret='4d1f50c9874949828f90db23e6dbedf1'

const spotifyApi = new SpotifyWebApi({
 clientId,
 clientSecret
})

//2.-configuracion
const app = express()
app.set('view engine','hbs')
app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({extended:true}))

//rutas
artists = require('./routes/artists')
app.use('/',artists)

spotifyApi.clientCredentialsGrant()
 .then(function(data) {
   spotifyApi.setAccessToken(data.body['access_token']);
 }, function(err) {
   console.log('Something went wrong when retrieving an access token', err);
})
app.listen(port,()=>{
  console.log('escuchando el puerto 3000')
 })