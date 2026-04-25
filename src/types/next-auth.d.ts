import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      token?: string;
      idUsuario?: number;
      rol?: number;
      nombrecompleto?: string;
      esEmpleadoResponsable?: boolean;
    };
  }

  interface User {
    token?: string;
    idUsuario?: number;
    rol?: number;
    nombrecompleto?: string;
    esEmpleadoResponsable?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    idUsuario?: number;
    rol?: number;
    nombrecompleto?: string;
    esEmpleadoResponsable?: boolean;
  }
}
