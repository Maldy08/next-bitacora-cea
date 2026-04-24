import { Tema } from "@/app/domain/entities";
import { TemaDto } from "@/app/domain/dtos";

export class TemaMapper {
  static toDto(tema: Tema): TemaDto {
    return {
      id: tema.id,
      titulo: tema.titulo,
      descripcion: tema.descripcion,
      estado: tema.estado,
      fechaCreacion: tema.fechaCreacion,
      fechaLimite: tema.fechaLimite,
      idDepartamentoOrigen: tema.idDepartamentoOrigen,
      nombreDepartamento: tema.nombreDepartamento ?? "",
      totalAvances: tema.avances?.length ?? 0,
      ultimoAvance: tema.avances?.length
        ? tema.avances[tema.avances.length - 1].fechaHora
        : null,
    };
  }
}
