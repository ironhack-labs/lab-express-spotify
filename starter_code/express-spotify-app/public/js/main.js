$(document).ready(function(){
  $('.owl-carousel').owlCarousel({
    loop:true,
    margin:50,
    nav:false,
    autoHeight:true,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:2,
        },
        900:{
          items:3,
        },
        1100:{
            items:4
        }
    }
  });
});


const msToMS = (ms) => {
  mss = parseInt(ms);
  let min = Math.floor(mss / 60000);
  var sec = ((mss % 60000) / 1000).toFixed(0);
  return min + ":" + (sec < 10 ? '0' : '') + sec;
}

var durs = $('.durationTrack');

durs.each((i,e)=>{
  let dur = msToMS($(e).text()) + " mins";
  $(e).text(dur);
});


$('.btnAlbum').click((e)=>{
  let album = $(e.currentTarget).prev().text();
  let hhref = $(e.currentTarget).find('a').attr('href') + '?albumName=' + album;
  $(e.currentTarget).find('a').attr('href', hhref)
  // e.preventDefault();
  // window.location.href = hhref;
});

$('.btnArtist').click((e)=>{
  let artist = $(e.currentTarget).prev().text();
  let hhref = $(e.currentTarget).find('a').attr('href') + '?artistName=' + artist;
  $(e.currentTarget).find('a').attr('href', hhref)
});
