export interface TemaInvolucrado {
  idAsignacion: number;
  idTema: number;
  idUsuario: number;
  tipoInvolucrado: "Responsable" | "Visualizador";
  fechaAsignacion?: Date;
  nombreUsuario?: string;
  tituloTema?: string;
}
