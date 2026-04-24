import { IEmpleadosRepository } from "@/app/application/interfaces";
import { Empleado } from "@/app/domain/entities";

export class GetAllEmpleadosUseCase {
  constructor(private readonly empleadosRepository: IEmpleadosRepository) {}

  async execute(token: string): Promise<Empleado[]> {
    return this.empleadosRepository.getAll(token);
  }
}
