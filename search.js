export async function main(event, context, callback) {
    const axios = require('axios');

    let config = {
        'X-API-KEY': process.env.bungieApiKey
    };

    const searchURL = "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/";
    const membershipType = event.queryStringParameters.membershipType;
    const displayName = event.queryStringParameters.displayName;
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