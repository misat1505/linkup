import { useTranslation } from "react-i18next";

export default function NoChats() {
  const { t } = useTranslation();

  return (
    <p className="text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
      {t("chats.no-chats")}
    </p>
  );
}
