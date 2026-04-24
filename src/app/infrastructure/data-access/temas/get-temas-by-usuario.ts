import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { TemaDto } from "@/app/domain/dtos";

export const getTemasByUsuario = async (idUsuario: number, token: string): Promise<TemaDto[]> => {
  try {
    const result = await DbAdapter.get<Result<TemaDto[]>>(`temas/usuario/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("getTemasByUsuario error:", error);
    throw error;
  }
};
