import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/lib/db";
import { UserRole } from "@/lib/types";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define types for next-auth
declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// Define types for callback parameters
interface SessionParams {
  session: any;
  token: JWT & {
    role?: UserRole;
    id?: string;
  };
}

interface JWTParams {
  token: JWT & {
    role?: UserRole;
    id?: string;
  };
  user: {
    id: string;
    role: UserRole;
  } | undefined;
}

// Define the authentication configuration
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find(user => user.email === credentials.email);
        
        if (!user || user.password !== credentials.password) {
          return null;
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error
  },
  debug: process.env.NODE_ENV === "development",
}

// Create the NextAuth handler
const handler = NextAuth(authConfig);

// Export auth for use in server components
export const auth = handler.auth;

export { handler as GET, handler as POST }; 