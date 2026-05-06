import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { Tema } from "@/app/domain/entities";

export const getTemaById = async (id: number, token: string): Promise<Tema> => {
  try {
    const result = await DbAdapter.get<Result<Tema>>(`temas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("getTemaById error:", error);
    throw error;
  }
};
