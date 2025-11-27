import { User } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "./db";

function getEmailFromRequest(req?: NextRequest): string | null {
  const headerEmail = req?.headers.get("x-user-email") ?? headers().get("x-user-email");
  const cookieEmail =
    cookies().get("user-email")?.value ?? cookies().get("demo-user-email")?.value;

  return headerEmail ?? cookieEmail ?? null;
}

export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  const email = getEmailFromRequest(req);

  if (!email) return null;

  return prisma.user.findUnique({
    where: { email }
  });
}

export function isCreator(user: User | null): user is User & { role: "CREATOR" } {
  return Boolean(user && user.role === "CREATOR");
}
