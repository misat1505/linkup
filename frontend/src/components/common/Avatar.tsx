import React from "react";
import Image from "./Image";
import { cn } from "../../lib/utils";
import { getStatus, Status, timeDifference } from "../../utils/timeDifference";
import { User } from "../../types/User";
import { ImCancelCircle } from "react-icons/im";

type AvatarProps = {
  src: string;
  alt: React.ReactNode;
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
    <div className="relative">
      <Image
        src={src}
        className={{
          common: cn("h-12 w-12 rounded-full bg-slate-200", className),
          img: "object-cover",
          error: "overflow-hidden bg-white font-semibold"
        }}
        errorContent={alt}
      />
      {lastActive && <ActivityStatus lastActive={lastActive} />}
    </div>
  );
}

function ActivityStatus({ lastActive }: { lastActive: User["lastActive"] }) {
  const difference = timeDifference(lastActive);
  const status = getStatus(difference);

  if (status.status === Status.ONLINE)
    return (
      <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border border-black bg-emerald-500" />
    );

  if (status.status === Status.OFFLINE)
    return (
      <ImCancelCircle className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-slate-500" />
    );

  const text = status.text;

  return (
    <div
      className="absolute bottom-0 right-0 h-4 w-fit overflow-hidden rounded-full border border-black bg-yellow-400 px-1 font-semibold text-black"
      style={{ fontSize: "0.6rem" }}
    >
      {text}
    </div>
  );
}
