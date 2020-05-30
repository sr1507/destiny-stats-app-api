import "./libs/algorithms-lib.js";
import { calculateKD, calculateKAD, getTotals } from "./libs/algorithms-lib.js";
import moment from "moment";
import { findIndexOfEarliestActivityWithinStartDate } from "./libs/utilities-lib.js";

export async function main(event, context, callback) {

  const axios = require("axios");

  let config = {
    "X-API-KEY": process.env.bungieApiKey,
  };

  const rootPath = "https://www.bungie.net/Platform/Destiny2/";
  const membershipType = event.queryStringParameters.membershipType;
  const membershipId = event.queryStringParameters.membershipId;
  const startDate = moment(event.queryStringParameters.startDate);

  await axios
    .get(rootPath + membershipType + "/Profile/" + membershipId + "/?components=100", { headers: config })
    .then((profileResponse) => getProfileActivities(profileResponse))
    .then((profileActivities) => {
      var statsResponse = {};
      statsResponse.totals = getTotals(profileActivities);
      statsResponse.killsDeathsRatio = calculateKD(statsResponse.totals);
      statsResponse.killsAssistsDeathsRatio = calculateKAD(statsResponse.totals);

      var apiResponse = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
        body: JSON.stringify(statsResponse),
      };


      callback(null, apiResponse);
    })
    .catch((e) => {
      console.log(e);
      callback(e);
    });

  function getProfileActivities(profileResponse) {
    return new Promise((resolve, reject) => {
      Promise.all(getCharacterActivityPromises(profileResponse.data.Response.profile.data.characterIds)).then((responseArray) => {
        var profileActivities = [];
        for (var i = 0; i < responseArray.length; i++) {
          profileActivities = profileActivities.concat(responseArray[i]);
        }
        resolve(profileActivities);
      });
    });
  }

  function getCharacterActivityPromises(characterIds) {
    var characterActivityPromises = [];
    for (var i = 0; i < characterIds.length; i++) {
      const characterActivityPromise = new Promise((resolve, reject) => {
        var character = {};
        character.characterId = characterIds[i];
        getCharacterActivities(characterIds[i], startDate).then((characterActivities) => {
          character.activities = characterActivities;
          resolve(character);
        });
      });
      characterActivityPromises.push(characterActivityPromise);
    }
    return characterActivityPromises;
  }

  function getCharacterActivities(characterId, startDate, page = 0, activities = []) {
    return new Promise((resolve, reject) => {
      const url = rootPath + membershipType + "/Account/" + membershipId + "/Character/" + characterId + "/Stats/Activities/?count=250&mode=5&page=" + page;
      axios.get(url, {headers: config}).then((activitiesResponse) => {
        var activityDate = {};
        if (activitiesResponse.data.Response.activities) {
          activityDate = moment(activitiesResponse.data.Response.activities[activitiesResponse.data.Response.activities.length - 1].period);
          if (activityDate.isBefore(startDate)) {
            // Only some of the activities on this page can be used
            var finalIndex = findIndexOfEarliestActivityWithinStartDate(activitiesResponse.data.Response.activities, startDate);
            if (finalIndex >= 0) {
              activities = activities.concat(activitiesResponse.data.Response.activities.slice(0, finalIndex + 1));
            }
            resolve(activities);
          } else {
            // All activities on this page can be used
            activities = activities.concat(activitiesResponse.data.Response.activities);
            resolve(getCharacterActivities(characterId, startDate, ++page, activities));
          }
        } else {
          // No activities returned on page
          resolve(activities);
        }
      });
    });
  }
}
