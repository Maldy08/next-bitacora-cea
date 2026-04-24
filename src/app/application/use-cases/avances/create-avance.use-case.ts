import { IAvancesRepository } from "@/app/application/interfaces";
import { Avance } from "@/app/domain/entities";

export class CreateAvanceUseCase {
  constructor(private readonly avancesRepository: IAvancesRepository) {}

  async execute(avance: Partial<Avance>, archivos: File[], token: string): Promise<Avance> {
    return this.avancesRepository.create(avance, archivos, token);
  }
}
