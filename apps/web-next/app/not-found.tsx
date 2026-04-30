import { buttonVariants } from "@/components/ui/button";
import logo from "@/assets/logo.webp";
import { I18nText } from "@/components/shared/i18n-text";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative h-[calc(100vh-5rem)]">
      <div className="absolute left-1/2 top-1/2 flex max-w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center shadow-lg bg-slate-200 p-4 dark:bg-slate-800">
        <Image
          src={logo}
          alt="logo"
          width={160}
          height={160}
          className="rounded-full object-cover"
        />
        <p className="mb-4 mt-6 text-center text-muted-foreground text-sm">
          <I18nText translationKey="not-found.description" />
        </p>
        <Link href="/" className={buttonVariants({ variant: "default" })}>
          <I18nText translationKey="not-found.button" />
        </Link>
      </div>
    </div>
  );
}
