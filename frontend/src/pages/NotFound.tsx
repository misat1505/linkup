import { useNavigate } from "react-router-dom";
import Image from "../components/common/Image";
import { LOGO_PATH } from "../constants";
import { Button } from "../components/ui/button";
import { ROUTES } from "../lib/routes";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[calc(100vh-5rem)]">
      <div className="absolute left-1/2 top-1/2 flex max-w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md bg-slate-200 p-4 dark:bg-slate-800">
        <Image
          src={LOGO_PATH}
          className={{ common: "h-40 w-40 rounded-full object-cover" }}
        />
        <p className="mb-4 mt-6 text-center text-black dark:text-white">
          Oops. It seems like you didn&apos;t want to go here.
        </p>
        <Button variant="blueish" onClick={() => navigate(ROUTES.HOME.$path())}>
          Bring me back home.
        </Button>
      </div>
    </div>
  );
}
