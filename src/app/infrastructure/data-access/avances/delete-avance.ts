import { DeleteAvanceUseCase } from "@/app/application/use-cases/avances/delete-avance.use-case";
import { AvancesRepositoryHttpImplementation } from "../../repositories/avances.repository.http.implementation";

export const deleteAvance = async (id: number, token: string): Promise<boolean> => {
  return new DeleteAvanceUseCase(new AvancesRepositoryHttpImplementation()).execute(id, token);
};
