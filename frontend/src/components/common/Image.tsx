import React, { ReactNode } from "react";
import { Img, ImgProps } from "react-image";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";

function DefaultLoader({ className }: { className?: string }) {
  return <Skeleton className={cn("h-full w-full", className)} />;
}

function DefaultError({
  className,
  content = "Error"
}: {
  className?: string;
  content?: ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex h-full w-full items-center justify-center",
        className
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
};

export default function Image({
  className: { common, img, loader: loader, error } = {},
  errorContent,
  loader: LoaderComponent,
  unloader,
  ...rest
}: ImageProps) {
  return (
    <Img
      {...rest}
      className={cn("h-full w-full", common, img)}
      loader={
        LoaderComponent || <DefaultLoader className={cn(common, loader)} />
      }
      unloader={
        unloader || (
          <DefaultError className={cn(common, error)} content={errorContent} />
        )
      }
    />
  );
}
