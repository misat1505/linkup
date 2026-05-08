"use client";

import { ReactNode } from "react";
import { ImgProps } from "react-image";
import {
  IMAGE_COMPONENT,
  IS_NEXT_IMAGE,
  useFetchProtectedURL,
} from "../../config";
import { cn } from "../../lib/utils";
import { Skeleton } from "../shadcn/skeleton";

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

type ImageProps = Omit<ImgProps, "className"> & {
  className?: {
    common?: string;
    img?: string;
    loader?: string;
    error?: string;
  };
  errorContent?: ReactNode;
  sizes?: string;
};

export function Image({
  className: { common, img, loader, error: errorClasses } = {},
  errorContent,
  loader: LoaderComponent,
  unloader,
  src,
  sizes,
}: ImageProps) {
  const { data, isError, isLoading } = useFetchProtectedURL(src as string);

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

  if (IS_NEXT_IMAGE) {
    return (
      <div className={cn("relative h-full w-full", common)}>
        <IMAGE_COMPONENT
          src={data!}
          alt={(src as string) || "image"}
          fill
          sizes={sizes ?? "48px"}
          className={cn("object-cover", common, img)}
        />
      </div>
    );
  }

  return (
    <IMAGE_COMPONENT
      className={cn("h-full w-full", common, img)}
      src={data!}
      alt={src as string}
    />
  );
}
