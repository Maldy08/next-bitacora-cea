import { Tema } from "@/app/domain/entities";
import { TemaDto, TemaContadoresDto } from "@/app/domain/dtos";

export abstract class ITemasRepository {
  abstract getAll(token: string): Promise<TemaDto[]>;
  abstract getByUsuario(idUsuario: number, token: string): Promise<TemaDto[]>;
  abstract getById(id: number, token: string): Promise<Tema>;
  abstract create(tema: Partial<Tema>, token: string): Promise<Tema>;
  abstract update(tema: Partial<Tema>, token: string): Promise<Tema>;
  abstract updateEstado(id: number, estado: string, token: string): Promise<boolean>;
  abstract delete(id: number, token: string): Promise<boolean>;
  abstract getContadores(token: string): Promise<TemaContadoresDto>;
}
