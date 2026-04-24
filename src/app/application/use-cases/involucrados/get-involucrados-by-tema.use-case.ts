import { IInvolucradosRepository } from "@/app/application/interfaces";
import { TemaInvolucrado } from "@/app/domain/entities";

export class GetInvolucradosByTemaUseCase {
  constructor(private readonly involucradosRepository: IInvolucradosRepository) {}

  async execute(idTema: number, token: string): Promise<TemaInvolucrado[]> {
    return this.involucradosRepository.getByTema(idTema, token);
  }
}
