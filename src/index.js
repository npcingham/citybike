
var Alexa = require('alexa-sdk');

var CallAPIs = require("./CallAPIs");


exports.handler = function(event, context, callback){

    var alexa = Alexa.handler(event, context);
    //alexa.appId = "amzn1.echo-sdk-ams.app.8c97fc78-342a-4e4f-823b-e2f91e7f3474";
    alexa.dynamoDBTableName = 'StationStore';  // Auto created.  Be sure to add Dynamo to your lambda execution role

    alexa.registerHandlers(handlers);
    alexa.execute();

};

var handlers = {
    'LaunchRequest': function () {
        // this.emit('StatusRequestIntent');
        this.emit('AMAZON.HelpIntent');
        
    },

    'SetStationIntent': function() {

        var stationNumber = this.event.request.intent.slots.stationNumber.value;
        if (stationNumber != null) {
            var beforePt = stationNumber.substr(0, 4);
            var afterPt = stationNumber.substr(4);
            var stationNumber = beforePt + "." + afterPt;
        }
        
        console.log("*STATION NUMBER*"+ stationNumber);
        if (stationNumber == null) { // no slot
            say = 'To save a station, let me know your station number with no dots or periods by saying for example, my station number is seven two six zero zero nine.';
        } else {
            // create and store session attributes
            this.attributes['stationNumber'] = stationNumber;
            var lodash = require("lodash");
            var dataset = require('./datafiles/stations.json');
            var stations = dataset["data"]["stations"];
            var stationDetail = lodash.filter(stations, { 'short_name': stationNumber } );
            console.log("**STATIONDETAIL**" + stationDetail);
            
            if (stationDetail != ""){
            	var stationName = stationDetail[0]["name"];
            	this.attributes['stationName'] = stationName;
              	var say = 'Your station, ' + stationName +', has been saved. Do you want to see how many bikes there are?';	
            }
            else {
            	var say = 'I\'m sorry, the station number ' + stationNumber + ' doesn\'t seem to be valid. Please try again.' ;
        	}
        }
        this.emit(':ask', say, say);
    },
    'AMAZON.YesIntent': function() {

        this.emit('StatusRequestIntent');
    },
    'AMAZON.NoIntent': function() {

        this.emit(':tell', 'Ok, see you next time!');
    },

    'StatusRequestIntent': function() {

        var stationName = this.attributes['stationName'];
        var stationNumber = this.attributes['stationNumber'];
        var say = "";

        if (stationName == null && stationNumber == null) { // no slot
            this.emit('AMAZON.HelpIntent');

        } else {
            // create and store session attributes
            CallAPIs.getPopFromAPI_POST(stationName,stationNumber,(pop => {
            
            if (pop == '1') {
                say = 'There is currenlty only 1 bike at ' + stationName;
                var cardTitle = '1 bike at ' + stationName;
                var cardContent = 'There is only 1 bike at ' + stationName + ' ('+ stationNumber + ')';
                var imageObj = {
                    smallImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_small_one.png',
                    largeImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_large_one.png'
                    }; 
            }
            
            if (pop == '0') {
                say = 'Sorry, there are currently no bikes at ' + stationName;
                var cardTitle = 'No bikes at ' + stationName;
                var cardContent = 'There are no bikes at ' + stationName + ' ('+ stationNumber + ')';
                var imageObj = {
                    smallImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_small_zero.png',
                    largeImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_large_zero.png'
                    }; 
            }

            else {
                say = 'There are currently '+ pop +  ' bikes at ' + stationName;
                var cardTitle = pop + ' bikes at ' + stationName;
                var cardContent = 'There are ' + pop + ' bikes at ' + stationName + ' ('+ stationNumber + ')';
                var imageObj = {
                    smallImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_small.png',
                    largeImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_large.png'
                    }; 
            }

            this.emit(':tellWithCard', say, cardTitle, cardContent, imageObj);
            }));
          }
    },

    'AMAZON.HelpIntent': function () {
                var say = 'Welcome to City Bike. To save your station have your station number ready by visiting city bike N Y C dot com slash map. Then to set your station say. ask city bike to manage my station. For future use, just say, Alexa, ask City Bike how many bikes are there.';
                var repeat = 'Say, manage my station or how many bikes are there';
                var cardTitle = 'Help for City Bike';
                var cardContent = '* SAVING/CHANGING STATION *\n To save your station have your station number ready by visiting:\n http://www.citibikenyc.com/map.\nSet your station by saying:\n "Ask City bike to manage my station" \n"Ask City bike to set my station to seven two six zero zero nine". \nRemember no dots or period should be used when telling Alexa your station number. \n-----------\n* EVERYDAY USE *\n To find out how many bikes are at your station just say: \n"Alexa, ask City Bike how many bikes are there."';
                var imageObj = {
                    smallImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_small.png',
                    largeImageUrl: 'https://s3.amazonaws.com/npcialexaassets/citybike_large.png'
                    };
        this.emit(':askWithCard', say, repeat, cardTitle, cardContent, imageObj);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell','Goodbye, thanks for using City Bike');
    }
}
// end of handlers

// ---------------------------------------------------  User Defined Functions ---------------
