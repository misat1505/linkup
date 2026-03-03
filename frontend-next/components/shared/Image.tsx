import { ReactNode } from "react";
import { ImgProps } from "react-image";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useFetchProtectedURL } from "@/hooks/useFetchProtectedURL";

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
  className: { common, img, loader, error: errorClasses } = {},
  errorContent,
  loader: LoaderComponent,
  unloader,
  src,
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

  return (
    <img
      className={cn("h-full w-full", common, img)}
      src={data!}
      alt={src as string}
    />
  );
}
