import { ITemasRepository } from "@/app/application/interfaces";
import { TemaDto } from "@/app/domain/dtos";

export class GetAllTemasUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(token: string): Promise<TemaDto[]> {
    return this.temasRepository.getAll(token);
  }
}
