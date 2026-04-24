import { IInvolucradosRepository } from "@/app/application/interfaces";

export class RemoveInvolucradoUseCase {
  constructor(private repo: IInvolucradosRepository) {}

  async execute(idTema: number, idUsuario: number, token: string): Promise<boolean> {
    return this.repo.remove(idTema, idUsuario, token);
  }
}
