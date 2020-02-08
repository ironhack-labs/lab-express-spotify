$(document).ready(function() {
    $(".backup").on("unknown", function(){
        console.log("holla")
        $(this).attr('src', '/images/fallback-image.jpg');
    });
});