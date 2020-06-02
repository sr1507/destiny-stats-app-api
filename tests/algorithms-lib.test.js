import * as algorithms from "../libs/algorithms-lib.js";

let response = require("../mocks/algorithms-test.json");

/*
kills = 105
deaths = 93
assists = 31
score = 70
time = 6368
*/

var totals = algorithms.getTotals(response.Response.activities);

test("Correct kills", () => {
    expect(totals.kills[5]).toEqual(105);
  });

test("Correct KDs", () => {
    var KDs = algorithms.calculateKDs(totals);
    expect(KDs[5]).toEqual(1.12903);
  });

test("Correct KDAs", () => {
    var KDAs = algorithms.calculateKDAs(totals);
    expect(KDAs[5]).toEqual(1.29570);
  });

test("Correct KADs", () => {
    var KADs = algorithms.calculateEfficiency(totals);
    expect(KADs[5]).toEqual(1.46237);
  });

test("Correct KPGAs", () => {
    var KPGAs = algorithms.calculateKillsPGAs(totals);
    expect(KPGAs[5]).toEqual(10.5);
  });

test("Correct WRs", () => {
    var WRs = algorithms.calculateWinRates(totals);
    expect(WRs[5]).toEqual(0.6);
  });

test("Correct Time", () => {
    var secondsPlayed = totals.timePlayedSeconds;
    expect(secondsPlayed[5]).toEqual(6368);
  });