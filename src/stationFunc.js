
        var request = require("request")
        var lodash = require("lodash")
        var dataset = require('./datafiles/stations.json');
        var stations = dataset["data"]["stations"];
        //console.log(stations);
        stationName = null;
        stationNumber = "5167.06";
        if(stationNumber!=null) {
            console.log('station number OK')
            var stationDetail = lodash.filter(stations, { 'short_name': stationNumber } );
        }
        
        
        if(stationName!=null) {
            console.log('station name OK')
        var stationDetail = lodash.filter(stations, { 'name': stationName } );
        }

        var stationID = stationDetail[0]["station_id"];
        console.log(stationName+" "+stationID)
