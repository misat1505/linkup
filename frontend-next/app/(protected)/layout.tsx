"use client";

import Loading from "@/components/shared/Loading";
import { useAppContext } from "@/providers/AppProvider";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
