window.onload = function() {
  $("#search-button").click(function() {
    if ($("input").val() == "") {
      alert("Please enter an artist.");
      return;
    }
  });
};
