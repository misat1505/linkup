import moment from "moment";

export type TimeDifference = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function timeDifference(date: Date, now = moment()): TimeDifference {
  const past = moment(date);

  const days = now.diff(past, "days");
  const hours = now.diff(past, "hours") % 24;
  const minutes = now.diff(past, "minutes") % 60;
  const seconds = now.diff(past, "seconds") % 60;

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

export enum Status {
  ONLINE,
  RECENTLY_ONLINE,
  OFFLINE
}

type StatusType =
  | { status: Status.ONLINE }
  | { status: Status.RECENTLY_ONLINE; text: string }
  | { status: Status.OFFLINE };

export function getStatus(difference: TimeDifference): StatusType {
  const { days, hours, minutes } = difference;
  if (days === 0 && hours === 0 && minutes <= 4)
    return { status: Status.ONLINE };
  if (days === 0 && hours === 0)
    return { status: Status.RECENTLY_ONLINE, text: `${minutes} min(s)` };
  if (days === 0)
    return { status: Status.RECENTLY_ONLINE, text: `${hours} hr(s)` };
  return { status: Status.OFFLINE };
}
