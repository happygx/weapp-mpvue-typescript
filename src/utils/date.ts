import { formatDate, getLastMonth } from './common';

let date = new Date();
let now = formatDate(date, 'yyyy-MM-dd');
let yesterday = getLastMonth().now;
let lastMonthDay = getLastMonth().last;
let minDate = new Date(
  date.getFullYear() - 3,
  date.getMonth() + 1,
  date.getDate()
).getTime();
let maxDate = date.getTime();

export { now, yesterday, lastMonthDay, minDate, maxDate };
