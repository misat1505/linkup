import { I18nText } from "@/components/shared/i18n-text";
import Link from "next/link";

export default function NoAccount() {
  return (
    <p className="mt-4 text-center text-sm">
      <I18nText translationKey="login.no-account" />{" "}
      <Link className="text-blue-700 underline" href="/signup">
        <I18nText translationKey="login.sign-in-redirect" />
      </Link>
    </p>
  );
}
