import { ITemasRepository } from "@/app/application/interfaces";
import { Tema } from "@/app/domain/entities";

export class GetTemaByIdUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(id: number, token: string): Promise<Tema> {
    return this.temasRepository.getById(id, token);
  }
}
