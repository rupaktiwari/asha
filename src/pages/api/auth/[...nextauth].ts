import NextAuth,{ NextAuthOptions }  from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'

import connect from "../../../../lib/mongodb";
import UsersL from '../../../../model/login'
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
 
  providers: [
    GoogleProvider({
      clientId:process.env.GOOGLE_ID,
      clientSecret:process.env.GOOGLE_SECRET,
    
    }),
    
   
    CredentialsProvider({
      name : "Credentials",
      
      async authorize(credentials, req){
          connect().catch(error => { error: "Connection Failed...!"})
         
          //The credentials entered by the user is checked with all the users registered in the database.
          const user = await UsersL.findOne( {email :credentials.email})
         
          if(!user){
              throw new Error("No user Found with Email Please Sign Up...!")
          }

          if(credentials.password !== user.password || user.email !== credentials.email){
              throw new Error("Username or Password doesn't match");
          }
         

          return user._doc;

      }
      }),
    ],
      callbacks: {
        async session(session, user) {
          console.log("session", { session, user });
          if (user && user.id) {
            session.user.id = user.id;
          }
          return session;
        },
        async jwt(token, user, account, profile, isNewUser) {
          console.log("jwt", { token, user });
          if (user && user._id) {
            token.id = user._id;
          }
          return token;
        },
     
      
// // }
 }
}
  
export default NextAuth(authOptions);



