import moment from "moment";

export function findIndexOfEarliestActivityWithinStartDate(activities, startDate) {
    var jump = activities.length;
    var currentIndex = 0;

    jump = Math.round(jump / 2);
    currentIndex += jump;

    while (jump > 1) {

      jump = Math.round(jump / 2);

      if ((moment(activities[currentIndex].period)).isAfter(startDate)) {
        currentIndex += jump;
        if (currentIndex >= activities.length) {
          currentIndex = activities.length - 1;
        }
      } else if ((moment(activities[currentIndex].period)).isBefore(startDate)) {
        currentIndex -= jump;
      } else {
        while(!(currentIndex == activities.length - 1 || (moment(activities[currentIndex + 1].period)).isBefore(startDate))){
          currentIndex += 1;
        }
        return currentIndex;
      }
    }
    return currentIndex;
  }