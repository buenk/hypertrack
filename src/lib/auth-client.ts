import { createAuthClient } from "better-auth/react";

// Get the base URL dynamically
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Browser should use relative URL
    return "";
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Default to localhost:3001 for development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
