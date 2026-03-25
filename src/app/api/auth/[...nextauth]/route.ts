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
        // Demo-only: requires explicit ENABLE_DEMO_AUTH=true opt-in AND a
        // matching DEMO_PASSWORD so that demo credentials never work on a
        // publicly accessible deployment unless both env vars are set.
        // TODO: Replace with real database lookup before any production deployment.
        if (
          process.env.ENABLE_DEMO_AUTH === 'true' &&
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
