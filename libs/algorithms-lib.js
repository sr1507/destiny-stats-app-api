export function calculateKD(profileActivities) {
  var totalKills = 1;
  var totalDeaths = 1;

  if (totalDeaths == 0) {
    totalDeaths = 1;
  }
  var kd = totalKills / totalDeaths;

  return kd;
}

export function calculateKAD(profileActivities) {
  var totalKills = 1;
  var totalDeaths = 1;
  var totalAssists = 1;

  if (totalDeaths == 0) {
    totalDeaths = 1;
  }
  var kad = (totalKills + totalAssists) / totalDeaths;

  return kad;
}
