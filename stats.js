import "./enums.js";
import "./libs/algorithms-lib.js";
import { calculateKD, calculateKAD } from "./libs/algorithms-lib.js";


export async function main(event, context, callback) {

  const axios = require('axios');

  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  };

  const input = JSON.parse(event);
  //const input = {};
  //input.membershipType = 2;
  //input.displayName = "SoJ--9";

  let config = {
    'X-API-KEY': process.env.bungieApiKey
  };

  const rootPath = "https://www.bungie.net/Platform/Destiny2/";

  var membershipId = getMembershipId(input.membershipType, input.displayName);
  var characterIds = getCharacterIds(input.membershipType, membershipId);

    var mode = 5;
    var page = 0;
    var accountActivities = {};

    for (var id in characterIds) {
      var characterActivities = getCharacterActivities(input.membershipType, membershipId, id, mode, page);
        accountActivities.push(characterActivities);
      }

    var statsResponse = {};
    statsResponse.killsDeathsRatio = calculateKD(accountActivities);
    statsResponse.killsAssistsDeathsRatio = calculateKAD(accountActivities);

    // Return status code 200 and the newly created item
    const apiResponse = {
      statusCode: 200,
      headers: responseHeaders,
      body: statsResponse
    };
    callback(null, apiResponse);

  async function getMembershipId(membershipType, displayName){
    var searchURL = rootPath + "SearchDestinyPlayer/" + membershipType + "/" + displayName + "/";
    await axios.get(searchURL, {headers: config}).then(searchResponse => {
      if (!searchResponse.data.Response.membershipId) {
        throw new Error("Destiny player not found.");
      }

      console.log("Data=" + JSON.stringify(searchResponse.data.Response));
      return searchResponse.data.Response.membershipId;
    });
  }

  async function getCharacterIds(membershipType, membershipId){
    var profileURL = rootPath + membershipType + "/Profile/" + membershipId + "/?components=100";

    await axios.get(profileURL, {headers: config}).then(profileResponse => {
    if (!profileResponse.data.Response.profile.data.characterIds) {
      throw new Error("Profile not found.");
    }
    console.log("Data=" + JSON.stringify(profileResponse.data.Response));

    return profileResponse.data.Response.profile.data.characterIds;
    });
  }

  async function getCharacterActivities(membershipType, membershipId, characterId, mode, page){
    var activityHistoryURL = rootPath + membershipType + "/Account/"+ membershipId + "/Character/" + characterId + "/Stats/Activities/?count=250&mode=" + mode + "&page=" + page;

    await axios.get(activityHistoryURL, {headers: config}).then(activitiesResponse => {
      if (!activitiesResponse.data.Response.activities) {
         throw new Error("Activities not found.");
      }

      var characterActivities = {};
      characterActivities.characterId = characterId;
      characterActivities.activities = activitiesResponse.data.Response.activities;

      return characterActivities;
    });
  }
}