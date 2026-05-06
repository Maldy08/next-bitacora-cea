import { Avance } from "@/app/domain/entities";
import { AvanceDto } from "@/app/domain/dtos";

export class AvanceMapper {
  static toDto(avance: Avance, tituloTema = ""): AvanceDto {
    return {
      idAvance: avance.idAvance,
      idTema: avance.idTema,
      tituloTema,
      idUsuario: avance.idUsuario,
      nombreUsuario: avance.nombreUsuario ?? "",
      observaciones: avance.observaciones,
      estado: avance.estado,
      fechaHora: avance.fechaHora,
      fechaEdicion: avance.fechaEdicion ?? null,
      adjuntos: avance.adjuntos?.map((a) => ({
        idAdjunto: a.idAdjunto,
        nombre: a.nombre,
        url: a.url,
        tipoMime: a.tipoMime,
      })) ?? [],
    };
  }
}
