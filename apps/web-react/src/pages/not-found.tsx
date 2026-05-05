import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { NotFoundPage } from "@packages/ui/components/misc/not-found-page";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.not-found"));

  return <NotFoundPage />;
}
