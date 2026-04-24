import { ITemasRepository } from "@/app/application/interfaces";
import { Tema } from "@/app/domain/entities";

export class CreateTemaUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(tema: Partial<Tema>, token: string): Promise<Tema> {
    return this.temasRepository.create(tema, token);
  }
}
