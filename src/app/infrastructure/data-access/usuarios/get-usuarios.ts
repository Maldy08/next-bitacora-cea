import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { Usuario } from "@/app/domain/entities";
import { UsuarioMapper } from "@/app/infrastructure/mappers/usuario.mapper";

export const getUsuarios = async (token: string): Promise<Usuario[]> => {
  try {
    const result = await DbAdapter.get<Result<any[]>>("usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return (result.data ?? []).map(UsuarioMapper.fromApi);
  } catch (error) {
    console.error("getUsuarios error:", error);
    throw error;
  }
};
