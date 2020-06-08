export function calculateKDs(totals) {
  var KDs = {};

  for (var mode of totals.gamemodeList) {
    if (totals.deaths[mode] == 0) {
      KDs[mode] = totals.kills[mode];
    } else {
      KDs[mode] = round(totals.kills[mode] / totals.deaths[mode]);
    }
  }
  return KDs;
}

export function calculateEfficiency(totals) {
  var KADs = {};

  for (var mode of totals.gamemodeList) {
    if (totals.deaths[mode] == 0) {
      KADs.mode = totals.kills[mode] + totals.assists[mode];
    } else {
      KADs[mode] = round((totals.kills[mode] + totals.assists[mode]) / totals.deaths[mode]);
    }
  }

  return KADs;
}

export function calculateKDAs(totals) {
  var KADs = {};

  for (var mode of totals.gamemodeList) {
    if (totals.deaths[mode] == 0) {
      KADs.mode = totals.kills[mode] + totals.assists[mode];
    } else {
      KADs[mode] = round((totals.kills[mode] + totals.assists[mode] / 2) / totals.deaths[mode]);
    }
  }

  return KADs;
}

export function calculateKillsPGAs(totals) {
  var killsPGAs = {};

  for (var mode of totals.gamemodeList) {
    killsPGAs[mode] = round(totals.kills[mode] / totals.gamesPlayed[mode]);
  }
  return killsPGAs;
}

export function calculateWinRates(totals) {
  var winRates = {};

  for (var mode of totals.gamemodeList) {
    winRates[mode] = round(totals.wins[mode] / totals.gamesPlayed[mode]);
  }

  return winRates;
}

export function getTotals(activities) {
  var totals = { gamemodeList: [], kills: {}, deaths: {}, assists: {}, score: {}, timePlayedSeconds: {}, wins: {}, losses: {}, gamesPlayed: {} };

  for (var activity of Array.from(activities)) {
    for (var mode of activity.activityDetails.modes)
      if (totals.gamemodeList.includes(mode)) {
        totals.kills[mode] += activity.values.kills.basic.value;
        totals.deaths[mode] += activity.values.deaths.basic.value;
        totals.assists[mode] += activity.values.assists.basic.value;
        totals.score[mode] += activity.values.score.basic.value;
        totals.timePlayedSeconds[mode] += activity.values.timePlayedSeconds.basic.value;
        totals.gamesPlayed[mode] += 1;
        if (mode == 48) {
          //Rumble
          if (activity.values.standing.basic.value == 0) {
            totals.wins[mode] += 1;
          } else {
            totals.losses[mode] += 1;
          }
        } else {
          totals.wins[mode] += 1;
          totals.losses[mode] += activity.values.standing.basic.value;
          totals.wins[mode] -= activity.values.standing.basic.value;
        }
      } else {
        totals.gamemodeList.push(mode);
        totals.kills[mode] = activity.values.kills.basic.value;
        totals.deaths[mode] = activity.values.deaths.basic.value;
        totals.assists[mode] = activity.values.assists.basic.value;
        totals.score[mode] = activity.values.score.basic.value;
        totals.timePlayedSeconds[mode] = activity.values.timePlayedSeconds.basic.value;
        totals.gamesPlayed[mode] = 1;
        if (mode == 48) {
          //Rumble
          if (activity.values.standing.basic.value == 0) {
            totals.wins[mode] = 1;
            totals.losses[mode] = 0;
          } else {
            totals.wins[mode] = 0;
            totals.losses[mode] = 1;
          }
        } else {
          totals.losses[mode] = activity.values.standing.basic.value;
          totals.wins[mode] = 1;
          totals.wins[mode] -= activity.values.standing.basic.value;
        }
      }
  }

  return totals;
}

export function round(number, decimals = 5) {
  return Math.round((number + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
