import { Adjunto } from "./adjunto";

export interface Avance {
  idAvance: number;
  idTema: number;
  idUsuario: number;
  observaciones: string;
  fechaHora: Date;
  nombreUsuario?: string;
  adjuntos?: Adjunto[];
}
