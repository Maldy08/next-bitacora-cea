import { IInvolucradosRepository } from "@/app/application/interfaces";
import { TemaInvolucrado } from "@/app/domain/entities";
import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";

export class InvolucradosRepositoryHttpImplementation implements IInvolucradosRepository {
  async getByTema(idTema: number, token: string): Promise<TemaInvolucrado[]> {
    const result = await DbAdapter.get<Result<TemaInvolucrado[]>>(`involucrados/tema/${idTema}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async assign(involucrado: Partial<TemaInvolucrado>, token: string): Promise<TemaInvolucrado> {
    const result = await DbAdapter.post<Result<TemaInvolucrado>>("involucrados", involucrado as Record<string, unknown>, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async remove(idTema: number, idUsuario: number, token: string): Promise<boolean> {
    const result = await DbAdapter.delete<Result<boolean>>(`involucrados/${idTema}/${idUsuario}`, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.succeeded;
  }
}
