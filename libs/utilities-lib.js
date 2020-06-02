import moment from "moment";
import { calculateKDs, calculateKDAs, getTotals, calculateEfficiency, calculateKillsPGAs, calculateWinRates } from "./algorithms-lib.js";

export function findIndexOfEarliestActivityWithinStartDate(activities, startDate) {
  var jump = activities.length;
  var currentIndex = 0;

  jump = Math.round(jump / 2);
  currentIndex += jump;

  while (jump > 1) {
    jump = Math.round(jump / 2);

    if (moment(activities[currentIndex].period).isAfter(startDate)) {
      currentIndex += jump;
      if (currentIndex >= activities.length) {
        currentIndex = activities.length - 1;
      }
    } else if (moment(activities[currentIndex].period).isBefore(startDate)) {
      currentIndex -= jump;
    } else {
      while (!(currentIndex == activities.length - 1 || moment(activities[currentIndex + 1].period).isBefore(startDate))) {
        currentIndex += 1;
      }
      return currentIndex;
    }
  }
  return currentIndex;
}

export function buildStats(activities) {
  var stats = {};
  stats.totals = getTotals(activities);
  stats.killsDeathsRatio = calculateKDs(stats.totals);
  stats.efficiency = calculateEfficiency(stats.totals);
  stats.killsDeathsAssists = calculateKDAs(stats.totals);
  stats.averageKills = calculateKillsPGAs(stats.totals);
  stats.winRate = calculateWinRates(stats.totals);

  return stats;
}
