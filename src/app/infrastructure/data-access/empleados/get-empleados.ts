import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";
import { Empleado } from "@/app/domain/entities";

export const getEmpleados = async (token: string): Promise<Empleado[]> => {
  try {
    const result = await DbAdapter.get<Result<Empleado[]>>("empleados", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data ?? [];
  } catch (error) {
    console.error("getEmpleados error:", error);
    throw error;
  }
};
