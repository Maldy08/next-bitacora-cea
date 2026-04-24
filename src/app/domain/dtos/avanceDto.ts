export interface AvanceDto {
  idAvance: number;
  idTema: number;
  tituloTema: string;
  idUsuario: number;
  nombreUsuario: string;
  observaciones: string;
  fechaHora: Date;
  adjuntos: AdjuntoDto[];
}

export interface AdjuntoDto {
  idAdjunto: number;
  nombre: string;
  url: string;
  tipoMime?: string;
}
