import ChatPageContent from "@/components/chats/chat-page-content";
import ChatPageProvider from "@/contexts/chat-page-provider";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { useTranslation } from "react-i18next";

export default function Chats() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.close-chat"));

  return (
    <div className="flex h-[calc(100vh-5rem)] w-screen">
      <ChatPageProvider>
        <ChatPageContent />
      </ChatPageProvider>
    </div>
  );
}
