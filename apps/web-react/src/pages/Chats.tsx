import ChatPageContent from "@/components/chats/ChatPageContent";
import ChatPageProvider from "@/contexts/ChatPageProvider";
import useChangeTabTitle from "@/hooks/useChangeTabTitle";
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
