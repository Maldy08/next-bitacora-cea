import { Empleado } from "@/app/domain/entities";

export class EmpleadosMapper {
  static fromApi(data: any): Empleado {
    return {
      empleado: data.empleado,
      nombre: data.nombre,
      paterno: data.paterno,
      materno: data.materno,
      nombreCompleto: data.nombreCompleto,
      correo: data.correo,
      descripcionPuesto: data.descripcionPuesto,
      descripcionDepto: data.descripcionDepto,
      deptoUe: data.deptoUe,
      nivel: data.nivel,
      activo: data.activo,
    };
  }
}
