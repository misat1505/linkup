"use client";

import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useFetchProtectedURL } from "@/hooks/useFetchProtectedURL";
import ImageNextjs from "next/image";

function DefaultLoader({ className }: { className?: string }) {
  return <Skeleton className={cn("h-full w-full", className)} />;
}

function DefaultError({
  className,
  content = "Error",
}: {
  className?: string;
  content?: ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      {content}
    </p>
  );
}

type ImageProps = {
  src: string;
  alt?: string;
  className?: {
    common?: string;
    img?: string;
    loader?: string;
    error?: string;
  };
  loader?: ReactNode;
  unloader?: ReactNode;
  errorContent?: ReactNode;
  sizes?: string;
};

export default function Image({
  className: { common, img, loader, error: errorClasses } = {},
  errorContent,
  loader: LoaderComponent,
  unloader,
  src,
  alt,
  sizes,
}: ImageProps) {
  const { data, isError, isLoading } = useFetchProtectedURL(src);

  if (!src || isError) {
    return (
      unloader || (
        <DefaultError
          className={cn(common, errorClasses)}
          content={errorContent}
        />
      )
    );
  }

  if (isLoading) {
    return LoaderComponent || <DefaultLoader className={cn(common, loader)} />;
  }

  return (
    <div className={cn("relative h-full w-full", common)}>
      <ImageNextjs
        src={data!}
        alt={alt || "image"}
        fill
        sizes={sizes ?? "48px"}
        className={cn("object-cover", common, img)}
      />
    </div>
  );
}
