$(document).ready(function() {

	var urlParams = new URLSearchParams(window.location.search);
	var token = urlParams.get('access_token');

  $("#artist-input").autocomplete({
	  messages: {
        noResults: '',
        results: function() {}
    },
    source: function(request, response) {				
		$.ajax({
            type: "GET",
            url: "https://api.spotify.com/v1/search",
			headers: {
        	Authorization: 'Bearer ' + token,
      	},
            dataType: "json",
            data: {
                type: "artist",
                limit: 3,
                contentType: "application/json; charset=utf-8",
                format: "json",
                q: request.term
            },
            success: function(data) {
             // console.log(data);
                response($.map(data.artists.items, function(item) {
                    return {
                        label: item.name,
                        value: item.name,
                        id: item.id
                    };
                }));
            }
        }); 
    },
    minLength: 3,
    select: function(event, ui) {
        $("#first-artist").val(ui.item.value);
        window.location.href = "#" + ui.item.value;
    },
});

});