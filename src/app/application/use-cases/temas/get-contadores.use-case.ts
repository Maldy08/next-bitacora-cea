import { ITemasRepository } from "@/app/application/interfaces";
import { TemaContadoresDto } from "@/app/domain/dtos";

export class GetContadoresUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(token: string): Promise<TemaContadoresDto> {
    return this.temasRepository.getContadores(token);
  }
}
