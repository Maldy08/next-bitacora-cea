import { ITemasRepository } from "@/app/application/interfaces";

export class UpdateTemaEstadoUseCase {
  constructor(private readonly temasRepository: ITemasRepository) {}

  async execute(id: number, estado: string, token: string): Promise<boolean> {
    return this.temasRepository.updateEstado(id, estado, token);
  }
}
