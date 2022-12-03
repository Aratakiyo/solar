import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SanityAdapter } from 'next-auth-sanity';
import { sanityClient } from '../../../sanity';
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    
    // ...add more providers here
    
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      authorization: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: SanityAdapter(sanityClient),
});
