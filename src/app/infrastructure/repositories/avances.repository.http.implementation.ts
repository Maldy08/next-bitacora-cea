import { IAvancesRepository } from "@/app/application/interfaces";
import { Avance } from "@/app/domain/entities";
import { AvanceDto } from "@/app/domain/dtos";
import { DbAdapter } from "@/app/infrastructure/adapters/db.adapter";
import { Result } from "@/app/domain/common/result";

export class AvancesRepositoryHttpImplementation implements IAvancesRepository {
  async getByTema(idTema: number, token: string): Promise<AvanceDto[]> {
    const result = await DbAdapter.get<Result<AvanceDto[]>>(`avances/tema/${idTema}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  async create(avance: Partial<Avance>, archivos: File[], token: string): Promise<Avance> {
    const formData = new FormData();
    formData.append("idTema", String(avance.idTema));
    formData.append("idUsuario", String(avance.idUsuario));
    formData.append("observaciones", avance.observaciones ?? "");
    if (avance.estado) formData.append("estado", avance.estado);
    archivos.forEach((f) => formData.append("adjuntos", f));

    const result = await DbAdapter.post<Result<Avance>>("avances", formData as any, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  }

  async update(id: number, observaciones: string, estado: string | undefined, token: string): Promise<boolean> {
    const result = await DbAdapter.put<Result<boolean>>(`avances/${id}`, { observaciones, estado }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.succeeded;
  }

  async delete(id: number, token: string): Promise<boolean> {
    const result = await DbAdapter.delete<Result<boolean>>(`avances/${id}`, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.succeeded;
  }
}
