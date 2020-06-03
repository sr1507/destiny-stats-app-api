import "./libs/algorithms-lib.js";
import moment from "moment";
import { findIndexOfEarliestActivityWithinStartDate, buildStats } from "./libs/utilities-lib.js";

export async function main(event, context, callback) {
  const axios = require("axios");

  var accountProfile = { characters: [], stats: {} };

  let config = {
    "X-API-KEY": process.env.bungieApiKey,
  };

  const rootPath = "https://www.bungie.net/Platform/Destiny2/";
  const membershipType = event.queryStringParameters.membershipType;
  const membershipId = event.queryStringParameters.membershipId;
  const startDate = moment(event.queryStringParameters.startDate);

  await axios
    .get(rootPath + membershipType + "/Profile/" + membershipId + "/?components=200", { headers: config })
    .then((profileResponse) => getProfileActivities(profileResponse))
    .then(() => {
      var apiResponse = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
        body: JSON.stringify(accountProfile),
      };

      callback(null, apiResponse);
    }).catch((e) => {
      console.log(e);
      callback(e);
    });

  function getProfileActivities(profileResponse) {
    return new Promise((resolve, reject) => {
      Promise.all(getCharacterActivityPromises(profileResponse)).then((characterProfileArray) => {
        var profileActivities = [];
        for (var i = 0; i < characterProfileArray.length; i++) {
          profileActivities = profileActivities.concat(characterProfileArray[i].activities);
          delete characterProfileArray[i].activities;
        }
        accountProfile.stats = buildStats(profileActivities);
        accountProfile.characters = characterProfileArray;
        resolve();
      }).catch((e) => {
        console.log(e.message);
        throw(e);
      });
    });
  }

  function getCharacterActivityPromises(profileResponse) {
    var characterIds = Object.keys(profileResponse.data.Response.characters.data);
    var characterActivityPromises = [];
      for (var i = 0; i < characterIds.length; i++) {
      const characterActivityPromise = new Promise((resolve, reject) => {
        var character = {};
        character.characterId = characterIds[i];
        getCharacterActivities(characterIds[i], startDate).then((characterActivities) => {
          var destinyClass = ["Titan", "Hunter", "Warlock"];
          var characterProfile = {};
          var characterData = profileResponse.data.Response.characters.data[character.characterId];

          characterProfile.characterID = character.characterId;
          characterProfile.emblem = "bungie.net" + characterData.emblemBackgroundPath;
          characterProfile.light = characterData.light;
          characterProfile.level = characterData.baseCharacterLevel;
          characterProfile.destinyClass = destinyClass[characterData.classType];
          characterProfile.stats = buildStats(characterActivities);
          characterProfile.activities = characterActivities;

          resolve(characterProfile);
        }).catch((e) => {
          console.log(e.message);
          throw(e);
        });
      }).catch((e) => {
        console.log(e.message);
        throw(e);
      });
      characterActivityPromises.push(characterActivityPromise);
    }
    return characterActivityPromises;
  }

  function getCharacterActivities(characterId, startDate, page = 0, activities = []) {
    return new Promise((resolve, reject) => {
      const url = rootPath + membershipType + "/Account/" + membershipId + "/Character/" + characterId + "/Stats/Activities/?count=250&mode=5&page=" + page;
      axios.get(url, { headers: config }).then((activitiesResponse) => {
        if (activitiesResponse.data.Response.activities && activitiesResponse.data.Response.activities.length > 0) {
          var lastActivityDateOnPage = moment(activitiesResponse.data.Response.activities[activitiesResponse.data.Response.activities.length - 1].period);
          var firstActivityDateOnPage = moment(activitiesResponse.data.Response.activities[0].period);
          if (lastActivityDateOnPage.isBefore(startDate)) {
            if (!firstActivityDateOnPage.isBefore(startDate)) {
              // Only some of the activities on this page can be used
              var finalIndex = findIndexOfEarliestActivityWithinStartDate(activitiesResponse.data.Response.activities, startDate);
              if (finalIndex >= 0) {
                activities = activities.concat(activitiesResponse.data.Response.activities.slice(0, finalIndex + 1));
              }
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
      }).catch((e) => {
        console.log(e.message);
        throw(e);
      });
    }).catch((e) => {
      console.log(e.message);
      throw(e);
    });
  }
}
