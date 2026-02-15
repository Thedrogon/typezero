import { auth } from "@/auth";

export default auth;

export const config = {
  // Matcher ignores static files (images, css) and api routes so they don't get blocked
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};