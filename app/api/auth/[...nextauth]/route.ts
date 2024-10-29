import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '', // デフォルト値を設定
      clientSecret: process.env.GITHUB_SECRET || '', // デフォルト値を設定
    }),
  ],
})

export { handler as GET, handler as POST }
