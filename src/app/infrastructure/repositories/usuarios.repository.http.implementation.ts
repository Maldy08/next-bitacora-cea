import { IUsuariosRepository } from "@/app/application/interfaces";
import { Usuario } from "@/app/domain/entities";
import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";

export class UsuariosRepositoryHttpImplementation implements IUsuariosRepository {
  async getAll(token: string): Promise<Usuario[]> {
    const result = await DbAdapter.get<Result<Usuario[]>>("usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async getById(id: number, token: string): Promise<Usuario> {
    const result = await DbAdapter.get<Result<Usuario>>(`usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }
}
