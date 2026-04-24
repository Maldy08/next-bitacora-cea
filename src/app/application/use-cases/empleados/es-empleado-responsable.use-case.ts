import { IEmpleadosRepository } from "@/app/application/interfaces";

export class EsEmpleadoResponsableUseCase {
  constructor(private readonly empleadosRepository: IEmpleadosRepository) {}

  async execute(idEmpleado: number, token: string): Promise<boolean> {
    return this.empleadosRepository.esEmpleadoResponsable(idEmpleado, token);
  }
}
