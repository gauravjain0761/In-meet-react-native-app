/* eslint-disable camelcase */
import { differenceInBusinessDays, differenceInYears, format, parse } from 'date-fns';
import moment from 'moment'
const convertDate = (time: string) => {
  if (!time) return '';
  const [ymd, hms] = time.split(' ');
  const [hours, mins, seconds] = hms.split(':');
  const [year, month, date] = ymd.split('-');
  return `${month}/${date} ${hours}:${mins}`;
};
const convertToYYMMDD = (time: string) => {
  if (!time) return '';
  const [ymd, hms] = time.split(' ');
  const [hours, mins, seconds] = hms.split(':');
  const [year, month, date] = ymd.split('-');
  return `${year}/${month}/${date}`;
};

const convertToMMDD = (time: string) => {
  if (!time) return '';
  const dayAndMonth = parse(time, 'yyyy-MM-dd HH:mm:ss', new Date());

  return format(dayAndMonth, 'MM 月 dd 日');
};
const calculateExpiredDate = (time: string) => {
  if (!time) return '';
  const [ymd, hms] = time.split(' ');
  const [hours, mins, seconds] = hms.split(':');
  const [year, month, date] = ymd.split('-');
  return `到期日${year}-${month}-${date}`;
};

const convertTime = (time: string) => {
  if (!time) return '';

  const [ymd, hms] = time.split(' ');
  const [hours, mins, seconds] = hms.split(':');
  const [year, month, date] = ymd.split('-');
  return ` ${hours}:${mins}`;
};

function calculateAge(time?: string) {
  if (!time) return '';
  const [ymd, hms] = time.split(' ');
  const date = parse(ymd, 'yyyy-MM-dd', new Date());
  const age = differenceInYears(new Date(), date);
  return age;
}
function calculateDays(time?: string) {
  if (!time) return '';
  const [ymd, hms] = time.split(' ');
  const date = parse(ymd, 'yyyy-MM-dd', new Date());
  const days = differenceInBusinessDays(new Date(), date);
  return days;
}

export {
  convertDate,
  convertTime,
  calculateAge,
  convertToYYMMDD,
  calculateExpiredDate,
  calculateDays,
  convertToMMDD,
};
