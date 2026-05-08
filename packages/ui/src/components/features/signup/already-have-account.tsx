import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";

export function AlreadyHaveAccount() {
  return (
    <p className="mt-4 text-center text-sm">
      <TRANSLATION_COMPONENT translationKey="signup.already-have-account" />{" "}
      <LINK_COMPONENT className="text-blue-700 underline" href={"/login"}>
        <TRANSLATION_COMPONENT translationKey="signup.login-redirect" />
      </LINK_COMPONENT>
    </p>
  );
}
