import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  token?: string;
  idUsuario?: number;
  rol?: number;
  nombrecompleto?: string;
  esEmpleadoResponsable?: boolean;
}

declare module "next-auth" {
  interface User extends IUser {
    token?: string;
    idUsuario?: number;
    rol?: number;
    nombrecompleto?: string;
    esEmpleadoResponsable?: boolean;
  }

  interface Session {
    user?: DefaultSession["user"] & IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    token?: string;
    idUsuario?: number;
    rol?: number;
    nombrecompleto?: string;
    esEmpleadoResponsable?: boolean;
  }
}
