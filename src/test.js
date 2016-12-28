var car = "hello world";
console.log(car)

var request = require("request")
var lodash = require("lodash")

var url = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"

request({
    url: url,
    json: true
}, function (error, response, body, callback) {

    if (!error && response.statusCode === 200) {
        // console.log(body) // Print the json 
        // var testFirstStation = body["data"]["stations"][0]["station_id"];
    	// console.log("The first station ID is %s.", testFirstStation);
    	var stations = body["data"]["stations"];
    	// console.log(stations);
    	var stationID = "3440";
    	var stationDetail = lodash.filter(stations, { 'station_id': stationID } );
    	// console.log(stationDetail);
    	var availableBikes = stationDetail[0]["num_bikes_available"];
    	console.log(availableBikes);
    	//callback (availableBikes);

    }
    
})
