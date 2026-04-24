import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";

export const esEmpleadoResponsable = async (
  idEmpleado: number,
  token: string
): Promise<boolean> => {
  try {
    const result = await DbAdapter.get<Result<boolean>>(
      `empleados/EsEmpleadoResponsable/${idEmpleado}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return result.data;
  } catch (error) {
    console.error("esEmpleadoResponsable error:", error);
    throw error;
  }
};
