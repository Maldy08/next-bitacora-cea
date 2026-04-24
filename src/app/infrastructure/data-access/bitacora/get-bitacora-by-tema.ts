import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { AvanceDto } from "@/app/domain/dtos";

export const getAvancesByTema = async (idTema: number, token: string): Promise<AvanceDto[]> => {
  try {
    const result = await DbAdapter.get<Result<AvanceDto[]>>(`bitacora/tema/${idTema}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("getAvancesByTema error:", error);
    throw error;
  }
};
