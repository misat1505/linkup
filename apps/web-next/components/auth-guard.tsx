"use client";

import { useAppContext } from "@/providers/app-provider";
import { Loading } from "@packages/ui/components/misc/loading";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type AuthGuardProps = PropsWithChildren;

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAppContext();

  if (isLoading)
    return (
      <div className="h-[calc(100vh-5rem)]">
        <Loading />
      </div>
    );

  if (!user) redirect("/login");

  return children;
}
