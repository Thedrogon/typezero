import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // This controls where users can go
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLanding = nextUrl.pathname === '/';

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      }

      if (isOnLanding) {
        if (isLoggedIn) {
          // If user is logged in and hits landing, bounce them to dashboard
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      return true;
    },
  },
  pages: {
    signIn: '/', // If they need to sign in, send them to landing (where your modal is)
  },
});