import { TemaInvolucrado } from "@/app/domain/entities";

export abstract class IInvolucradosRepository {
  abstract getByTema(idTema: number, token: string): Promise<TemaInvolucrado[]>;
  abstract assign(involucrado: Partial<TemaInvolucrado>, token: string): Promise<TemaInvolucrado>;
  abstract remove(idTema: number, idUsuario: number, token: string): Promise<boolean>;
}
