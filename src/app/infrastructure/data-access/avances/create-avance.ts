import { CreateAvanceUseCase } from "@/app/application/use-cases/avances/create-avance.use-case";
import { Avance } from "@/app/domain/entities";
import { AvancesRepositoryHttpImplementation } from "../../repositories/avances.repository.http.implementation";

export const createAvance = async (avance: Partial<Avance>, archivos: File[], token: string): Promise<Avance> => {
  return new CreateAvanceUseCase(new AvancesRepositoryHttpImplementation()).execute(avance, archivos, token);
};
