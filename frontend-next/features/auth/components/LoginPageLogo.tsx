import logo from "@/assets/logo.webp";
import Image from "next/image";

export default function LoginPageLogo() {
  return (
    <Image
      src={logo}
      className="mx-auto mb-20 aspect-square w-64 rounded-full"
      alt="Couldn't display logo"
    />
  );
}
