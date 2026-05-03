"use client";
import { IMAGE_COMPONENT, LOGO_PATH } from "../../../config";

export function LoginPageLogo() {
  return (
    <IMAGE_COMPONENT
      src={LOGO_PATH}
      width={256}
      height={256}
      className="mx-auto mb-20 aspect-square w-64 rounded-full"
      alt="Couldn't display logo"
    />
  );
}
