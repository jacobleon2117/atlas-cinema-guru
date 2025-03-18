import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  theme: {
    brandColor: "#54F4D0",
    logo: "/logo.png",
    colorScheme: "light"
  },
  providers: [
    GitHub,
  ],
  callbacks: {
    authorized: ({ auth }) => {
      return !!auth;
    },
    redirect: ({ url, baseUrl }: { url: string, baseUrl: string }) => {
      if (url.startsWith(baseUrl)) {
        return "/dashboard";
      }
      else if (url.startsWith("/")) {
        return `${baseUrl}/dashboard`;
      }
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);