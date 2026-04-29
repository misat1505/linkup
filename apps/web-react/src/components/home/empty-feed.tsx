import { LOGO_PATH } from "@/constants";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function EmptyFeed() {
  const { t } = useTranslation();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 p-6 shadow-lg flex flex-col items-center text-center space-y-4 w-72 max-w-[calc(100vw-1rem)]">
      <img
        src={LOGO_PATH}
        className="w-36 h-36 rounded-full object-cover"
        alt="Logo"
      />
      <h2 className="text-xl font-semibold">{t("home.feed.empty.title")}</h2>
      <p className="text-muted-foreground text-sm">
        {t("home.feed.empty.description")}
      </p>
      <Link
        to={ROUTES.POST_EDITOR.$buildPath({ params: { postId: undefined } })}
        className={buttonVariants({ variant: "default" })}
      >
        {t("home.feed.empty.action")}
      </Link>
    </div>
  );
}
