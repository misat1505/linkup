import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInSeconds,
} from "date-fns";
import { TranslateFn } from "../config";

export type TimeDifference = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export function timeDifference(date: Date, now: Date = new Date()): TimeDifference {
	const days = differenceInDays(now, date);
	const hours = differenceInHours(now, date) % 24;
	const minutes = differenceInMinutes(now, date) % 60;
	const seconds = differenceInSeconds(now, date) % 60;

	return {
		days,
		hours,
		minutes,
		seconds,
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

export function getStatus(difference: TimeDifference, t: TranslateFn): StatusType {
	const { days, hours, minutes } = difference;
	if (days === 0 && hours === 0 && minutes <= 4) return { status: Status.ONLINE };
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

export function useGetReadableCommentUploadDate(diff: TimeDifference, t: TranslateFn): string {
	const { days, hours, minutes } = diff;

	if (days >= 365)
		return t("common.time.years", {
			count: String(Math.floor(days / 365)),
		});
	if (days >= 30)
		return t("common.time.months", {
			count: String(Math.floor(days / 30)),
		});
	if (days >= 7)
		return t("common.time.weeks", {
			count: String(Math.floor(days / 7)),
		});
	if (days > 0) return t("common.time.days", { count: String(days) });
	if (hours > 0) return t("common.time.hours", { count: String(hours) });
	if (minutes > 0)
		return t("common.time.minutes", {
			count: String(minutes),
		});

	return t("common.time.now");
}
