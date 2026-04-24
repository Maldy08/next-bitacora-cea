import { AssignInvolucradoUseCase } from "@/app/application/use-cases/involucrados/assign-involucrado.use-case";
import { TemaInvolucrado } from "@/app/domain/entities";
import { InvolucradosRepositoryHttpImplementation } from "../../repositories/involucrados.repository.http.implementation";

export const assignInvolucrado = async (data: Partial<TemaInvolucrado>, token: string): Promise<TemaInvolucrado> => {
  return new AssignInvolucradoUseCase(new InvolucradosRepositoryHttpImplementation()).execute(data, token);
};
