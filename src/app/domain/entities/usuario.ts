// Roles: 1=Admin, 2=Responsable, 3=Visualizador
export interface Usuario {
  id: number;
  nombre: string;
  paterno: string;
  materno: string;
  nombreCompleto: string;
  email: string;
  rol: number;
  activo: boolean;
}
