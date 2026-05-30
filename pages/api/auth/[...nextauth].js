import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import Company from '../../../models/Company';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase(), active: true });
        if (!user) return null;

        // Support both passwordHash and password fields
        const hash = user.passwordHash || user.password;
        if (!hash) return null;

        const ok = await bcrypt.compare(credentials.password, hash);
        if (!ok) return null;

        let companyName = '';
        if (user.companyId) {
          const company = await Company.findById(user.companyId);
          companyName = company?.name || '';
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email,
          role: user.role,
          companyId: user.companyId?.toString() || '',
          companyName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.companyId = user.companyId;
        token.companyName = user.companyName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.companyId = token.companyId;
      session.user.companyName = token.companyName;
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'kraya-ap-secret-change-in-prod',
};

export default NextAuth(authOptions);
