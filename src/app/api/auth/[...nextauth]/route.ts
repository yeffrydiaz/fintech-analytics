import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Replace with real database lookup before deploying to production.
        // Demo-only: accepts a fixed credential pair exclusively outside of production.
        if (
          process.env.NODE_ENV !== 'production' &&
          credentials?.email === 'demo@example.com' &&
          credentials?.password === process.env.DEMO_PASSWORD
        ) {
          return { id: '1', email: 'demo@example.com', name: 'Demo User' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
