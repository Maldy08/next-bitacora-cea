import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { TemaDto } from "@/app/domain/dtos";

export const getTemas = async (token: string): Promise<TemaDto[]> => {
  try {
    const result = await DbAdapter.get<Result<TemaDto[]>>("temas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("getTemas error:", error);
    throw error;
  }
};
