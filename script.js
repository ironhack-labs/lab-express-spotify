const searchButton = document.getElementById('search-button')

searchButton.addEventListener('click', ()=>{
    const searchedArtist = document.getElementById('searched-artist').value

    const artist = {searchedArtist}
    console.log(artist)


//RUTA GET CON AXIS
    axios ('http://localhost:4000')


})  