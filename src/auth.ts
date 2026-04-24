import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const { data } = await axios.post(
          `${process.env.URL_API_CEA}Auth/login?user=${credentials.email}&password=${credentials.password}`
        );

        if (data) {
         // if (!data.userData.bitacora || data.userData.bitacora === 0) {
           // throw new Error("NoPermissions");
         // }

          return {
            id: String(data.userData.usuario),
            token: data.token,
            name: data.username,
            email: data.email,
            idUsuario: data.userData.noEmpleado,
            rol: undefined,
            nombrecompleto: data.userData.nombreCompleto,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = (user as any).token;
        token.idUsuario = (user as any).idUsuario;
        token.rol = (user as any).rol;
        token.nombrecompleto = (user as any).nombrecompleto;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).token = token.token;
        (session.user as any).idUsuario = token.idUsuario;
        (session.user as any).rol = token.rol;
        (session.user as any).nombrecompleto = token.nombrecompleto;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/bitacora/Dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
