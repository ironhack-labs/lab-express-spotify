const body = document.getElementsByTagName("body")[0];
const nav = document.createElement("nav");
nav.innerHTML = `
<nav id="nav">
    <div class="nav-search">
        <form action="/artist-search" method="GET">
            <input type="text" name="q" placeholder="insert artist name">
            <button type="submit">search</button>
        </form>
    </div>
</nav>
`

// this adds a menu with search functionality when not on the homepage
window.onload = function() {
    if(window.location.pathname !== "/"){
        body.insertBefore(nav, body.firstChild)
    }
}