import { ITemasRepository } from "@/app/application/interfaces";
import { TemaDto } from "@/app/domain/dtos";

export class GetTemasByUsuarioUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(idUsuario: number, token: string): Promise<TemaDto[]> {
    return this.temasRepository.getByUsuario(idUsuario, token);
  }
}
