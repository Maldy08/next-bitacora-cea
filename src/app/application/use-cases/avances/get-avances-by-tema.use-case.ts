import { IAvancesRepository } from "@/app/application/interfaces";
import { AvanceDto } from "@/app/domain/dtos";

export class GetAvancesByTemaUseCase {
  constructor(private readonly avancesRepository: IAvancesRepository) {}

  async execute(idTema: number, token: string): Promise<AvanceDto[]> {
    return this.avancesRepository.getByTema(idTema, token);
  }
}
