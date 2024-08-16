import React from "react";
import Image from "./Image";

import { cn } from "../../lib/utils";

type AvatarProps = {
  src: string;
  alt: string;
  lastActive?: Date;
  className?: string;
};

export default function Avatar({
  src,
  alt,
  lastActive,
  className
}: AvatarProps) {
  return (
    <Image
      src={src}
      className={{
        common: cn("h-12 w-12 rounded-full bg-slate-200", className),
        img: "object-cover",
        error: "bg-white font-semibold"
      }}
      errorContent={alt}
    />
  );
}
