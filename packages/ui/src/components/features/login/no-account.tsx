import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";

export function NoAccount() {
  return (
    <p className="mt-4 text-center text-sm">
      <TRANSLATION_COMPONENT translationKey="login.no-account" />{" "}
      <LINK_COMPONENT href="/signup" className="text-blue-700 underline">
        <TRANSLATION_COMPONENT translationKey="login.sign-in-redirect" />
      </LINK_COMPONENT>
    </p>
  );
}
