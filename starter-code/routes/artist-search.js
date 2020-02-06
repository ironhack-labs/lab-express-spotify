const express = require('express');


spotifyApi
    .searchArtists( /*'HERE GOES THE QUERY ARTIST'*/ )
    .then(data => {
        console.log('The received data from the API: ', data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));