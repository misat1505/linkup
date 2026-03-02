import { I18nText } from "@/components/shared/I18nText";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Button>
      <I18nText translationKey="tabs.chats" values={{ name: "bbb" }} />
    </Button>
  );
}
