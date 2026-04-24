import { Usuario } from "@/app/domain/entities";

export class UsuarioMapper {
  static fromApi(data: any): Usuario {
    return {
      id: data.idUsuario ?? data.id,
      nombre: data.nombre,
      paterno: data.paterno,
      materno: data.materno,
      nombreCompleto: data.nombreCompleto,
      email: data.email ?? data.correo,
      rol: data.rol,
      activo: data.activo,
    };
  }
}
