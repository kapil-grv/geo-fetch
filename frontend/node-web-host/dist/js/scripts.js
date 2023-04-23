var map = L.map('map');

function fetchLocDetailsByIP() {

  const ip = $('#inputIp').val();

  const indexUrl = `http://127.0.0.1:9200/ip2loc/_doc/${ip}?pipeline=geoip`;
  const indexData = {
    ip: ip
  };

  const searchUrl = `http://127.0.0.1:9200/ip2loc/_doc/${ip}`;

  async function run () {
    // Send an HTTP PUT request to index the document in Elasticsearch with the pipeline `geoip` using Axios:
    await axios.put(indexUrl, indexData)
      .then(response => {
        console.log('Document indexed successfully');
      })
      .catch(error => {
        console.error(`Indexing failed. Status code: ${error.response.status}`);
      });

    // Send an HTTP GET request to search for the document in Elasticsearch using the _id:
    await axios.get(searchUrl)
      .then(response => {
        console.log(response);
        if ('geoip' in response.data._source) {
          const location = response.data._source.geoip.location;
          console.log(`Latitude: ${location.lat}, Longitude: ${location.lon}`);
          plotData(response);
        } else {
          notAvailableResponse();
          console.log(`NA`);
        }

      })
      .catch(error => {
        console.error(`Search failed. Status code: ${error}`);
      });
  }

  run().catch(console.log);

}

function notAvailableResponse() {

  function showErrorPopup() {
    errorPopup.removeClass('hidden');

    setTimeout(function() {
      hideErrorPopup();
    }, 10000);
  }

  function hideErrorPopup() {
    errorPopup.addClass('hidden');
  }
  
  // Disable the response div on the UI
  const responseDiv = $('#response-section');

  if (responseDiv.css('display') === 'block') {
    responseDiv.hide();
  }

  const errorPopup = $('#error-popup');
  showErrorPopup();

  errorPopup.on('click', function() {
    hideErrorPopup();
  });

  $(document).on('click', function(event) {
    if (!errorPopup.is(event.target) && errorPopup.has(event.target).length === 0) {
      hideErrorPopup();
    }
  });
}

function plotData(response) {

  var location = response.data._source.geoip.location;

  // Enable the response div on the UI
  const responseDiv = $('#response-section');
  if (responseDiv.css('display') === 'none') {
    responseDiv.show();
  }
  
  // Check if the map exists
  console.log(`map initializing`);
  if (typeof map === "object") {
    // Update the view
    map.setView([location.lat, location.lon], 5);
    console.log(`map updated`);
  }

  // Add the tile layer to the map
    // == OSM
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    //     maxZoom: 18,
    //     id: 'mapbox.outdoors-v11'
    // }).addTo(map);

    // == Mapbox
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '<a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-streets-v11',
      accessToken: 'pk.eyJ1Ijoia2FwaWxncnYiLCJhIjoiY2toZjdrcnplMDFlOTJybXVpYXI4dTgweCJ9.E--E7cmqSN8u2mmqNtVp4Q'
    }).addTo(map);

  // Add marker based on API response coordinates
  L.marker([location.lat, location.lon]).addTo(map);

  // Navigate to the response section of the UI
  $("html, body").animate({ scrollTop: responseDiv.offset().top }, 1000);

  // Adding the table with other details
  const $tableOld = $('#details-table');
  if ($tableOld.length) {
    $tableOld.remove();
  }

  const tableContainer = $('#response-section');

  // Create a new table element
  const table = $('<table></table>').attr('id', 'details-table');

  // Add a table header row
  const headerRow = $('<tr></tr>');
  const headers = ['Continent Name', 'Region ISO Code', 'City Name', 'Country ISO Code', 'Country Name', 'Region Name', 'Latitude', 'Longitude'];
  for (let header of headers) {
    const th = $('<th></th>').text(header);
    headerRow.append(th);
  }
  table.append(headerRow);

  // Add a table row for each item in the data array
  const data = response.data._source.geoip;
  const row = $('<tr></tr>');
  row.append($('<td></td>').text(data.continent_name));
  row.append($('<td></td>').text(data.region_iso_code));
  row.append($('<td></td>').text(data.city_name));
  row.append($('<td></td>').text(data.country_iso_code));
  row.append($('<td></td>').text(data.country_name));
  row.append($('<td></td>').text(data.region_name));
  row.append($('<td></td>').text(data.location.lat));
  row.append($('<td></td>').text(data.location.lon));
  table.append(row);

  // Append the table to the DOM element
  tableContainer.append(table);
}