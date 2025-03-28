import { TFunction } from "i18next";
import moment from "moment";
import { useTranslation } from "react-i18next";

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
    seconds: seconds,
  };
}

export enum Status {
  ONLINE,
  RECENTLY_ONLINE,
  OFFLINE,
}

type StatusType =
  | { status: Status.ONLINE }
  | { status: Status.RECENTLY_ONLINE; text: string }
  | { status: Status.OFFLINE };

export function getStatus(
  difference: TimeDifference,
  t: TFunction<"translation", undefined>
): StatusType {
  const { days, hours, minutes } = difference;
  if (days === 0 && hours === 0 && minutes <= 4)
    return { status: Status.ONLINE };
  if (days === 0 && hours === 0)
    return {
      status: Status.RECENTLY_ONLINE,
      text: `${minutes} ${t("chats.user-activity.time-units.min")}`,
    };
  if (days === 0)
    return {
      status: Status.RECENTLY_ONLINE,
      text: `${hours} ${t("chats.user-activity.time-units.hr")}`,
    };
  return { status: Status.OFFLINE };
}

export function useGetReadableCommentUploadDate(diff: TimeDifference): string {
  const { t } = useTranslation();
  const { days, hours, minutes } = diff;

  if (days >= 365)
    return t("common.time.years", { count: Math.floor(days / 365) });
  if (days >= 30)
    return t("common.time.months", { count: Math.floor(days / 30) });
  if (days >= 7) return t("common.time.weeks", { count: Math.floor(days / 7) });
  if (days > 0) return t("common.time.days", { count: days });
  if (hours > 0) return t("common.time.hours", { count: hours });
  if (minutes > 0) return t("common.time.minutes", { count: minutes });

  return t("common.time.now");
}
