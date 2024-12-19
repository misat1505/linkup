import React from "react";
import { LOGO_PATH } from "../../constants";
import Image from "../common/Image";

export default function LoginPageLogo() {
  return (
    <Image
      src={LOGO_PATH}
      className={{
        common: "mx-auto mb-20 aspect-square w-64 rounded-full",
        error: "bg-white text-lg font-semibold"
      }}
      errorContent="Couldn't display logo"
    />
  );
}
