'use strict';

angular.module('powerApp')
  .service('Powerapi', function Powerapi($http, Auth) {
    
	var meterID = "0e6e348bfdb74432b6709526527c3d12";
	var LatestValue_url = 'https://api.demosteinkjer.no/meters/' + meterID + '/latest?seriesType=ActivePlus';
	var url = "https://api.demosteinkjer.no/meters/" + meterID;

    Auth.setCredentials("3749f5da4f0d427faf9ed00bb616576e", "7bf19829a91144028101feb1740bafb9");
    var apiNumber;

	function fetch() {
		var xsrf = $.param({ // verdiene i formen.
				seriesType: 'ActivePlus',
				dateFrom: '2013-12-12',
				dateTo: '2014-02-13',
				intervalType: 'Hour'
		});
		$http({method: 'POST',
			url: url,
			data: xsrf,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Access-Control-Expose-Headers': 'location'
				} // Gjør at man sender post request som en form.
		})

		.then(function(response) {
			var loc = response.data.indexOf('https://api.demosteinkjer.no/downloads/');
			var loc2 = response.data.indexOf('">https://api.demosteinkjer.no/downloads/');
			apiNumber = response.data.substring(loc+39,loc2);

			$http({
				method: 'GET',
				url: "https://api.demosteinkjer.no/downloads/" + "611",
				headers: {'Content-type': 'application/json'}
			}).success(function(data, status, headers) {
				console.log(data);
				console.log(status)
			}).error(function(data, status) {
				console.log(data || "Request failed");
				console.log(status);
			});
		});
	};

	return {
		getLatestReading: function()
	}
  });
