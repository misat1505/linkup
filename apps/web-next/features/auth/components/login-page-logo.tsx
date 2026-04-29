import logo from "@/assets/logo.webp";
import Image from "next/image";

export default function LoginPageLogo() {
  return (
    <Image
      src={logo}
      width={256}
      height={256}
      className="mx-auto mb-20 rounded-full"
      alt="Couldn't display logo"
    />
  );
}
