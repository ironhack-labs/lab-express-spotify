//Event Listener
const searchArtistButton = document.getElementById('search-artist-button')

searchArtistButton.addEventListener('click', ()=> {
    const name = document.getElementById('name').value //to get the value (name) after click the button

    window.location.href=`http://localhost:5000/artist-search/${name}`
})