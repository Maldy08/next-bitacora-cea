import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      token?: string;
      idUsuario?: number;
      rol?: number;
      nombrecompleto?: string;
    };
  }

  interface User {
    token?: string;
    idUsuario?: number;
    rol?: number;
    nombrecompleto?: string;
  }
}
