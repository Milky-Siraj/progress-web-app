import connectDB from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // makes u choose for email every time
      authorization: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  callbacks: {
    //invoke on successful signin
    async signIn({ profile, account }) {
      //1. connect to the db
      await connectDB();
      
      // Only handle Google sign-in
      if (account?.provider === 'google') {
        //2. check if user exists
        const userExists = await User.findOne({ email: profile.email });
        //3 if user doesnt exist add user
        if (!userExists) {
          const username = profile.name.slice(0, 20);

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }
      }
      return true;
    },
    async session({ session }) {
      //1. Get user from database
      const user = await User.findOne({ email: session.user.email });
      // 2. Assign the user id to the session
      session.user.id = user._id.toString();
      // 3. return session
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
