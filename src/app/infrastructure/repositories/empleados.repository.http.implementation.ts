import { IEmpleadosRepository } from "@/app/application/interfaces";
import { Empleado } from "@/app/domain/entities";
import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";

export class EmpleadosRepositoryHttpImplementation implements IEmpleadosRepository {
  async getAll(token: string): Promise<Empleado[]> {
    const result = await DbAdapter.get<Result<Empleado[]>>("empleados", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async esEmpleadoResponsable(idEmpleado: number, token: string): Promise<boolean> {
    const result = await DbAdapter.get<Result<boolean>>(
      `empleados/EsEmpleadoResponsable/${idEmpleado}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return result.data;
  }
}
