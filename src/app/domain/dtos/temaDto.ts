export interface TemaDto {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: Date;
  fechaLimite: Date | null;
  idDepartamentoOrigen: number;
  nombreDepartamento: string;
  totalAvances: number;
  ultimoAvance: Date | null;
}
