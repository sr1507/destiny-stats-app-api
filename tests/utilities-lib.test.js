import {findIndexOfEarliestActivityWithinStartDate,buildStats} from "../libs/utilities-lib";

var activities = [
  {
    "period": "2019-08-06T13:07:35Z"
  }, {
    "period": "2019-08-04T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-03T13:07:35Z"
  }, {
    "period": "2019-08-02T13:07:35Z"
  }, {
    "period": "2019-08-01T13:07:35Z"
  }
];

test("test 1", () => {
  const startDate = "2019-08-01T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(10);
});

test("test 2", () => {
  const startDate = "2019-08-02T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(9);
});

test("test 3", () => {
  const startDate = "2019-08-03T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(8);
});

test("test 4", () => {
  const startDate = "2019-08-04T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(1);
});

test("test 5", () => {
  const startDate = "2019-08-05T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(0);
});

test("test 6", () => {
  const startDate = "2019-08-06T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(0);
});

test("test 7", () => {
  const startDate = "2019-08-07T13:07:35Z";
  var index = findIndexOfEarliestActivityWithinStartDate(activities, startDate);
  expect(index).toEqual(0);
});












let response = require("../mocks/algorithms-test.json");
var expectedStats = {totals:{
  gamemodeList: [
     5, 70, 10, 73,
    84, 69, 37
  ],
  kills: {
    '5': 105,
    '10': 25,
    '37': 59,
    '69': 59,
    '70': 25,
    '73': 25,
    '84': 21
  },
  deaths: {
    '5': 93,
    '10': 16,
    '37': 52,
    '69': 52,
    '70': 16,
    '73': 16,
    '84': 25
  },
  assists: { 
    '5': 31,
    '10': 3, 
    '37': 22, 
    '69': 22, 
    '70': 3, 
    '73': 3, 
    '84': 6 
  },
  score: {
    '5': 70,
    '10': 36,
    '37': 17,
    '69': 17,
    '70': 36,
    '73': 36,
    '84': 17
  },
  timePlayedSeconds: {
    '5': 6368,
    '10': 648,
    '37': 3631,
    '69': 3631,
    '70': 648,
    '73': 648,
    '84': 2089
  },
  wins: { '5': 6, '10': 0, '37': 3, '69': 3, '70': 0, '73': 0, '84': 3 },
  losses: { '5': 4, '10': 1, '37': 2, '69': 2, '70': 1, '73': 1, '84': 1 },
  gamesPlayed: { '5': 10, '10': 1, '37': 5, '69': 5, '70': 1, '73': 1, '84': 4 }
},
    killsDeathsRatio : { '5': 1.12903, '10': 1.5625, '37': 1.13462, '69': 1.13462, '70': 1.5625, '73': 1.5625, '84': 0.84 },
    efficiency : { '5': 1.46237, '10': 1.75, '37': 1.55769, '69': 1.55769, '70': 1.75, '73': 1.75, '84': 1.08 },
    killsDeathsAssists : { '5': 1.2957, '10': 1.65625, '37': 1.34615, '69': 1.34615, '70': 1.65625, '73': 1.65625, '84': 0.96 },
    averageKills : { '5': 10.5, '10': 25, '37': 11.8, '69': 11.8, '70': 25, '73': 25, '84': 5.25 },
    winRate : { '5': 0.6, '10': 0, '37': 0.6, '69': 0.6, '70': 0, '73': 0, '84': 0.75 }
}

test("Build Stats", () => {
    var stats = buildStats(response.Response.activities);
    expect(JSON.stringify(stats)).toEqual(JSON.stringify(expectedStats));
  });
