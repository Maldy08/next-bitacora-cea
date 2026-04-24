import { IInvolucradosRepository } from "@/app/application/interfaces";
import { TemaInvolucrado } from "@/app/domain/entities";

export class AssignInvolucradoUseCase {
  constructor(private readonly involucradosRepository: IInvolucradosRepository) {}

  async execute(involucrado: Partial<TemaInvolucrado>, token: string): Promise<TemaInvolucrado> {
    return this.involucradosRepository.assign(involucrado, token);
  }
}
