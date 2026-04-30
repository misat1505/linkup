import { I18nText } from "@/components/shared/i18n-text";
import Link from "next/link";

export default function AlreadyHaveAccount() {
  return (
    <p className="mt-4 text-center text-sm">
      <I18nText translationKey="signup.already-have-account" />{" "}
      <Link className="text-blue-700 underline" href="/login">
        <I18nText translationKey="signup.login-redirect" />
      </Link>
    </p>
  );
}
