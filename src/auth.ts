import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

const SESSION_MAX_AGE = 60 * 60 * 12;

const getResultData = <T>(payload: T | { data: T }): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
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
          const idEmpleado = data.userData.noEmpleado;
          const responsableResponse = await axios.get(
            `${process.env.URL_API_CEA}Empleados/EsEmpleadoResponsable/${idEmpleado}`,
            { headers: { Authorization: `Bearer ${data.token}` } }
          );
          const esEmpleadoResponsable = Boolean(getResultData<boolean>(responsableResponse.data));

          return {
            id: String(data.userData.usuario),
            token: data.token,
            name: data.username,
            email: data.email,
            idUsuario: idEmpleado,
            idDepartamento: data.userData.depto as number,
            rol: undefined,
            nombrecompleto: data.userData.nombreCompleto,
            esEmpleadoResponsable,
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
    maxAge: SESSION_MAX_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.COOKIE_SECURE === "true",
        maxAge: SESSION_MAX_AGE,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.idUsuario = user.idUsuario;
        token.idDepartamento = user.idDepartamento;
        token.rol = user.rol;
        token.nombrecompleto = user.nombrecompleto;
        token.esEmpleadoResponsable = user.esEmpleadoResponsable;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.token = token.token as string | undefined;
        session.user.idUsuario = token.idUsuario as number | undefined;
        session.user.idDepartamento = token.idDepartamento as number | undefined;
        session.user.rol = token.rol as number | undefined;
        session.user.nombrecompleto = token.nombrecompleto as string | undefined;
        session.user.esEmpleadoResponsable = token.esEmpleadoResponsable as boolean | undefined;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/bitacora/Dashboard`;
    },
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});



//estatus por avances, cada avance debe tener un estatus independiente del estatus del tema, 
// al momento de capturar un avance se le muestra al usuario el estatus del tema, por si no lo quiere cambiar, aunque podra cambiarlo.

//verificar que las fechas se guardan con dia y hora, para que se puedan ordenar correctamente, y no solo con la fecha sin hora.
//en el detalle del tema, mostrar el estatus del tema, y el estatus de cada avance, para que se pueda ver el historial de cambios de estatus.
//en el detalle del tema, mostrar el historial de cambios de estatus, con la fecha y hora de cada cambio, para que se pueda ver el historial completo del tema.
//