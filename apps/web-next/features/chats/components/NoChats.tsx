import { I18nText } from "@/components/shared/I18nText";

export default function NoChats() {
  return (
    <p className="text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
      <I18nText translationKey="chats.no-chats" />
    </p>
  );
}
