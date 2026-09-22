import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

/**
 * Verifies the caller is signed in. Every Server Action and data query must
 * call this itself — a page-level redirect does not protect actions, which
 * are reachable directly (see Next.js data-security guide).
 */
export const requireUserId = cache(async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
});
