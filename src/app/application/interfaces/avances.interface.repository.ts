import { Avance } from "@/app/domain/entities";
import { AvanceDto } from "@/app/domain/dtos";

export abstract class IAvancesRepository {
  abstract getByTema(idTema: number, token: string): Promise<AvanceDto[]>;
  abstract create(avance: Partial<Avance>, archivos: File[], token: string): Promise<Avance>;
  abstract update(id: number, observaciones: string, estado: string | undefined, token: string): Promise<boolean>;
  abstract delete(id: number, token: string): Promise<boolean>;
}
