import { UpdateAvanceUseCase } from "@/app/application/use-cases/avances/update-avance.use-case";
import { AvancesRepositoryHttpImplementation } from "../../repositories/avances.repository.http.implementation";

export const updateAvance = async (id: number, observaciones: string, estado: string | undefined, token: string): Promise<boolean> => {
  return new UpdateAvanceUseCase(new AvancesRepositoryHttpImplementation()).execute(id, observaciones, estado, token);
};
