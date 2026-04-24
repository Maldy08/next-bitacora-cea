import { Departamento } from "@/app/domain/entities";

export abstract class IDepartamentosRepository {
  abstract getAll(token: string): Promise<Departamento[]>;
  abstract getById(id: number, token: string): Promise<Departamento>;
}
