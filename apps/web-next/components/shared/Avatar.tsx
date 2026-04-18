"use client";
import { cn } from "@/lib/utils";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { getStatus, Status, timeDifference } from "@/utils/timeDifference";
import { User } from "@packages/schemas";
import React from "react";
import { ImCancelCircle } from "react-icons/im";
import Image from "./Image";

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
  className,
}: AvatarProps) {
  return (
    <div className="relative">
      <Image
        src={src}
        // @ts-expect-error alt can be react node
        alt={alt}
        className={{
          common: cn(
            "h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800",
            className,
          ),
          img: "object-cover",
          error: "overflow-hidden bg-white font-semibold dark:bg-black",
        }}
        errorContent={alt}
      />
      {lastActive && <ActivityStatus lastActive={lastActive} />}
    </div>
  );
}

function ActivityStatus({ lastActive }: { lastActive: User["lastActive"] }) {
  const { t } = useLanguageContext();
  const difference = timeDifference(lastActive);
  const status = getStatus(difference, t);

  if (status.status === Status.ONLINE)
    return (
      <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border border-black bg-emerald-500" />
    );

  if (status.status === Status.OFFLINE)
    return (
      <ImCancelCircle className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-slate-500 dark:text-black" />
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
