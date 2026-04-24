import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { Tema } from "@/app/domain/entities";

export const createTema = async (tema: Partial<Tema>, token: string): Promise<Tema> => {
  try {
    const result = await DbAdapter.post<Result<Tema>>("temas", tema as Record<string, unknown>, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error) {
    console.error("createTema error:", error);
    throw error;
  }
};
