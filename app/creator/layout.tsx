import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function CreatorLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/billing");
  }

  if (user.role !== "CREATOR") {
    redirect("/billing/upgrade-required");
  }

  return <>{children}</>;
}
