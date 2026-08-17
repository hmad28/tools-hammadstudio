import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Hammad Studio Admin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@hammad.studio" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@hammad.studio";
        const adminPassword = process.env.ADMIN_PASSWORD || "hammad123";

        const email = String(credentials?.email || "").trim();
        const password = String(credentials?.password || "");

        if (email === adminEmail && password === adminPassword) {
          return {
            id: "admin-1",
            name: "Hammad Studio Admin",
            email: adminEmail,
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/documents") ||
        nextUrl.pathname.startsWith("/clients") ||
        nextUrl.pathname.startsWith("/projects") ||
        nextUrl.pathname.startsWith("/presets") ||
        nextUrl.pathname.startsWith("/settings");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to /login
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "hammad-studio-secret-key-2026-very-secure",
};
