import { TemaInvolucrado } from "./temaInvolucrado";
import { Avance } from "./avance";

export interface Tema {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "Pendiente" | "Activo" | "Pausado" | "Completado";
  fechaCreacion: Date;
  fechaLimite: Date | null;
  idDepartamentoOrigen: number;
  nombreDepartamento?: string;
  involucrados?: TemaInvolucrado[];
  avances?: Avance[];
}
