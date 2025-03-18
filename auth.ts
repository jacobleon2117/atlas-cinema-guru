// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    brandColor: "#1ED2AF",
    logo: "/logo.png",
    buttonText: "#000000",   // Black text
    colorScheme: "light"     // Light theme (white background)
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    // Add this redirect callback to ensure proper redirection
    redirect({ url, baseUrl }) {
      // Always redirect to the dashboard after signing in
      if (url.startsWith(baseUrl)) {
        return "/dashboard";
      }
      // Allows relative callback URLs
      else if (url.startsWith("/")) {
        return `${baseUrl}/dashboard`;
      }
      return baseUrl;
    },
  },
  // IMPORTANT: Remove the custom sign-in page reference if it doesn't exist
  // pages: {
  //   signIn: "/custom-signin",
  // },
});