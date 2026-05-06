import { Adjunto } from "./adjunto";

export type EstadoTema = "Pendiente" | "Activo" | "Pausado" | "Completado";

export interface Avance {
  idAvance: number;
  idTema: number;
  idUsuario: number;
  observaciones: string;
  estado: EstadoTema;
  fechaHora: Date;
  fechaEdicion?: Date | null;
  nombreUsuario?: string;
  adjuntos?: Adjunto[];
}
