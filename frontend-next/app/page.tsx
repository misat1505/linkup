import { I18nText } from "@/components/shared/I18nText";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/theme-switch";

export default function Home() {
  return (
    <div>
      <Switch />
      <Button>
        <I18nText translationKey="tabs.chats" values={{ name: "bbb" }} />
      </Button>
    </div>
  );
}
