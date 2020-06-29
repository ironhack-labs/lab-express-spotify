const imgs = [...document.querySelectorAll('img')]
imgs.map(element =>{
    if(element.getAttribute("src") == ""){
        element.setAttribute("src", "/images/noPhoto.jpg")
    }
})
