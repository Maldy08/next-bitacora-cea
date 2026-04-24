import { Empleado } from "@/app/domain/entities";

export abstract class IEmpleadosRepository {
  abstract getAll(token: string): Promise<Empleado[]>;
  abstract esEmpleadoResponsable(idEmpleado: number, token: string): Promise<boolean>;
}
