import { buttonVariants } from "@/components/ui/button";
import { LOGO_PATH } from "@/constants";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative h-[calc(100vh-5rem)]">
      <div className="absolute left-1/2 top-1/2 flex max-w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center shadow-lg bg-slate-200 p-4 dark:bg-slate-800">
        <img src={LOGO_PATH} className="h-40 w-40 rounded-full object-cover" />
        <p className="mb-4 mt-6 text-center text-muted-foreground text-sm">
          Oops. It seems like you didn&apos;t want to go here.
        </p>
        <Link
          to={ROUTES.HOME.$path()}
          className={buttonVariants({ variant: "default" })}
        >
          Bring me back home.
        </Link>
      </div>
    </div>
  );
}
