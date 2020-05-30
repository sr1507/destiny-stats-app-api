import {findIndexOfEarliestActivityWithinStartDate} from "../libs/utilities-lib";

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