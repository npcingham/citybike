var Alexa = require('alexa-sdk');
var https = require('https');

module.exports = {

    getPopFromAPI_POST: function(stationName,stationNumber,callback) {
        var request = require("request")
        var lodash = require("lodash")
        
        //Match Name of station with an ID from local table
        var dataset = require('./datafiles/stations.json');
        var stations = dataset["data"]["stations"];
        //console.log(stations);
        //stationName = "Franklin St & W Broadway"
        stationName = stationName;
        stationNumber = stationNumber;
        console.log('*Name*'+stationName+'*Number* '+stationNumber)

        if(stationNumber!= null) {
            var stationDetail = lodash.filter(stations, { 'short_name': stationNumber } );
        }
        
        
        if(stationName!= null) {
        var stationDetail = lodash.filter(stations, { 'name': stationName } );
        }
        var stationID = stationDetail[0]["station_id"];
        console.log("StationID: " + stationID)

        var url = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"

        request({
             url: url,
             json: true,
         }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                // console.log(body) // Print the json 
                // var testFirstStation = body["data"]["stations"][0]["station_id"];
                // console.log("The first station ID is %s.", testFirstStation);
                var stations = body["data"]["stations"];
                // console.log(stations);
                // var stationID = this.attributes['stationName'];
                // var stationID = "3440";
                var stationDetail = lodash.filter(stations, { 'station_id': stationID } );
                // console.log(stationDetail);
                var availableBikes = stationDetail[0]["num_bikes_available"];
                // console.log(availableBikes);
                callback(availableBikes);
            }
        
        })
    
    }
}
