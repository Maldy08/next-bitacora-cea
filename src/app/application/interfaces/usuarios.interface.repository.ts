import { Usuario } from "@/app/domain/entities";

export abstract class IUsuariosRepository {
  abstract getAll(token: string): Promise<Usuario[]>;
  abstract getById(id: number, token: string): Promise<Usuario>;
}
