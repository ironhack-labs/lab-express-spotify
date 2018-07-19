window.onload = coverSize;
window.onresize = coverSize;


function coverSize(){
    let maxheight = 0;
    for(let i=0; i<document.getElementsByClassName('cover').length; i++)
    {
        document.getElementsByClassName('cover')[i].style.height = document.getElementsByClassName('info')[0].offsetWidth + 'px';
        document.getElementsByClassName('cover')[i].style.width = document.getElementsByClassName('info')[0].offsetWidth + 'px';
        document.getElementsByClassName('cover')[i].getElementsByTagName('img')[0].style.minWidth = document.getElementsByClassName('cover')[i].style.width;
        document.getElementsByClassName('cover')[i].getElementsByTagName('img')[0].style.minHeight = document.getElementsByClassName('cover')[i].style.width;
        if (document.getElementsByClassName('info')[i].offsetHeight > maxheight) maxheight = document.getElementsByClassName('info')[i].offsetHeight;
    }
    for(let i=0; i<document.getElementsByClassName('info').length; i++)
    {
        document.getElementsByClassName('info')[i].style.height = maxheight + 'px';
    }
}