import { ITemasRepository } from "@/app/application/interfaces";
import { Tema } from "@/app/domain/entities";
import { TemaDto, TemaContadoresDto } from "@/app/domain/dtos";
import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";

export class TemasRepositoryHttpImplementation implements ITemasRepository {
  async getAll(token: string): Promise<TemaDto[]> {
    const result = await DbAdapter.get<Result<TemaDto[]>>("temas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async getByUsuario(idUsuario: number, token: string): Promise<TemaDto[]> {
    const result = await DbAdapter.get<Result<TemaDto[]>>(`temas/usuario/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async getById(id: number, token: string): Promise<Tema> {
    const result = await DbAdapter.get<Result<Tema>>(`temas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async create(tema: Partial<Tema>, token: string): Promise<Tema> {
    const result = await DbAdapter.post<Result<Tema>>("temas", tema as Record<string, unknown>, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async update(tema: Partial<Tema>, token: string): Promise<Tema> {
    const result = await DbAdapter.put<Result<Tema>>(`temas/${tema.id}`, tema as Record<string, unknown>, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async updateEstado(id: number, estado: string, token: string): Promise<boolean> {
    const result = await DbAdapter.put<Result<boolean>>(`temas/estado/${id}/${estado}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.succeeded;
  }

  async delete(id: number, token: string): Promise<boolean> {
    const result = await DbAdapter.delete<Result<boolean>>(`temas/${id}`, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.succeeded;
  }

  async getContadores(token: string): Promise<TemaContadoresDto> {
    const result = await DbAdapter.get<Result<TemaContadoresDto>>("temas/contadores", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }
}
