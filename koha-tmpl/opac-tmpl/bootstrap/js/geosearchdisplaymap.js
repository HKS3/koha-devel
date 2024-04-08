$( document ).ready(function() {
  if ($("#geo_search_map")) {

    var biblionumbers = [];
    $(".addtocart").each(function() {
      biblionumbers.push( $(this).attr("data-biblionumber") );
    });
    if (biblionumbers.length === 0) {
      $('#geo_search_map').hide();
      return;
    }
    var map = L.map('geo_search_map');
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    $(function(e) {
      var ajaxData = { 'bn': biblionumbers };
      $.ajax({
        url: '/api/v1/public/biblios/geo',
        type: 'GET',
        dataType: 'json',
        data: ajaxData,
        traditional: true
      })
      .done(function(data) {
        var bounds = L.latLngBounds()
        $.each(data['data'], function( index, value ) {
          var marker = L.marker(value['coordinates']).addTo(map);
          marker.bindPopup(index+1 + '. ' + value['title'] );
          bounds.extend(value['coordinates']);
        });
        map.fitBounds(bounds);
      })
      .error(function(data) {});
    });
  }
});
