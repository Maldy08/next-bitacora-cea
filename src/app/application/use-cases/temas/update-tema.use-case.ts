import { ITemasRepository } from "@/app/application/interfaces";
import { Tema } from "@/app/domain/entities";

export class UpdateTemaUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(tema: Partial<Tema>, token: string): Promise<Tema> {
    return this.temasRepository.update(tema, token);
  }
}
