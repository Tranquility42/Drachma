import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Only wires up session/token propagation so `auth()` works in Server
 * Components and Server Actions. Route-matching `auth.protect()` here is
 * deprecated by Clerk in favor of resource-based checks — every data query
 * and Server Action already calls `requireUserId()` (see src/lib/dal.ts),
 * which is the actual authorization boundary.
 */
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|manifest.webmanifest|sw.js|.*\\..*).*)"],
};
