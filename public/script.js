//Frontend JS

//Event listener to pass the info from search artist to the backend
const searchArtistButton = document.getElementById('search-artist-button')

searchArtistButton.addEventListener('click', () => {
    const name = document.getElementById('name').value //Get name value after clicking button

    //Change the url so the seach route in the backend activates
    window.location.href = `http://localhost:3000/artist-search/${name}`
})