const searchButton = document.getElementById("request-button");

searchButton.addEventListener("click", () => {

    const search = document.getElementById('search').value
    window.location.href = `/artist-search-results/${search}`

});



// const albumsButton = document.getElementById("albums-button");

// albumsButton.addEventListener("click", () => {

//     const artistId = document.getElementById('artistId').value
//     window.location.href = `/albums/${artistId}`

// });