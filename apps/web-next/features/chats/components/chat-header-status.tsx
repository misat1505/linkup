"use client";

import { useLanguageContext } from "@/providers/language-provider";
import { getStatus, Status, timeDifference } from "@/utils/time-difference";

type ChatHeaderStatusProps = {
  lastActive: Date;
};

export default function ChatHeaderStatus({
  lastActive,
}: ChatHeaderStatusProps) {
  const { t } = useLanguageContext();

  const createStatus = (): React.ReactNode => {
    const result = getStatus(timeDifference(lastActive), t);
    if (result.status === Status.ONLINE) return t("chats.user-activity.online");
    if (result.status === Status.OFFLINE)
      return t("chats.user-activity.offline");
    return result.text + " " + t("common.time.ago");
  };

  return createStatus();
}
