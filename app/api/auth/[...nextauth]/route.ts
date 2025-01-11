import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/app/_lib/prisma";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }
        console.log("Credentials received:", credentials);
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          console.log(email, password); // Log to verify input

          if (!user) {
            console.error("No user found with that email:", email);
            throw new Error("No user found with that email");
          }

          // Compare the plain password with the hashed password stored in the database
          const isValidPassword = await bcrypt.compare(password, user.password);
          console.log(isValidPassword); // Log comparison result

          if (!isValidPassword) {
            console.error("Invalid password attempt for user:", email);
            throw new Error("Invalid password");
          }

          return { id: user.id, email: user.email, name: user.name };
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user = session.user || {};
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }: any) {
      // Redirect to the page the user tried to access
      if (url.includes("/protected")) {
        return url;
      }
      // Redirect to home after login
      return baseUrl;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
