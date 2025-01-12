import { LOGO_PATH } from "@/constants";

export default function LoginPageLogo() {
  return (
    <img
      src={LOGO_PATH}
      className="mx-auto mb-20 aspect-square w-64 rounded-full"
      alt="Couldn't display logo"
    />
  );
}
