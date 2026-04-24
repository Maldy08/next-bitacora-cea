import { IUsuariosRepository } from "@/app/application/interfaces";
import { Usuario } from "@/app/domain/entities";

export class GetAllUsuariosUseCase {
  constructor(private readonly usuariosRepository: IUsuariosRepository) {}

  async execute(token: string): Promise<Usuario[]> {
    return this.usuariosRepository.getAll(token);
  }
}
