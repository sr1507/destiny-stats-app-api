export async function main(event, context, callback) {
    const axios = require('axios');

    let config = {
        'X-API-KEY': process.env.bungieApiKey
    };

    const searchURL = "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/";
    const membershipType = event.queryStringParameters.membershipType;
    var displayName = event.queryStringParameters.displayName;
    if(displayName == process.env.smokeTestDisplayName){
        displayName = process.env.smokeTestAltDisplayName;
    }
    console.log(searchURL);
    console.log(event);
    await axios.get(searchURL + membershipType + "/" + displayName + "/", {headers: config}).then(searchResponse => {

        var bungieProfileResponse = searchResponse.data.Response;
        var apiResponse = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
            "body": JSON.stringify(bungieProfileResponse)
        };
        console.log(apiResponse);
        callback(null, apiResponse);
    }).catch(e => {
        console.log(e);
        callback(e);
    });
}