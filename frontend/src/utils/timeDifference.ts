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
    return { status: Status.RECENTLY_ONLINE, text: `${minutes}m` };
  if (days === 0) return { status: Status.RECENTLY_ONLINE, text: `${hours}hr` };
  return { status: Status.OFFLINE };
}

export function getReadableCommentUploadDate(diff: TimeDifference): string {
  const { days, hours, minutes, seconds } = diff;

  if (days >= 365) {
    const years = Math.floor(days / 365);
    return years === 1 ? "1 year" : `${years} years`;
  }

  if (days >= 30) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }

  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }

  if (days > 0) return days === 1 ? "1 day" : `${days} days`;

  if (hours > 0) return hours === 1 ? "1 hour" : `${hours} hours`;

  if (minutes > 0) return minutes === 1 ? "1 minute" : `${minutes} minutes`;

  if (seconds > 0) return seconds === 1 ? "1 second" : `${seconds} seconds`;

  return "now";
}
