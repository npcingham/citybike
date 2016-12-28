var https = require('https');

// console.log("test begin");

var post_data =
{
    "usstate":
    "Maine"
};

var post_options = {
    host:  'rmwum5l4zc.execute-api.us-east-1.amazonaws.com',
    port: '443',
    path: '/prod/stateresource',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
    }
};

var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    var returnData = "";
    res.on('data', function (chunk) {
        returnData += chunk;
    });
    res.on('end', function () {
        console.log('returnData: ' + returnData);

        console.log(JSON.parse(returnData).attributes[0].population);

    });

});

post_req.write(JSON.stringify(post_data));
post_req.end();
