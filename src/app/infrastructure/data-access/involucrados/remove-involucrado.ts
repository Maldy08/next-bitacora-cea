import { RemoveInvolucradoUseCase } from "@/app/application/use-cases/involucrados/remove-involucrado.use-case";
import { InvolucradosRepositoryHttpImplementation } from "../../repositories/involucrados.repository.http.implementation";

export const removeInvolucrado = async (idTema: number, idUsuario: number, token: string): Promise<boolean> => {
  return new RemoveInvolucradoUseCase(new InvolucradosRepositoryHttpImplementation()).execute(idTema, idUsuario, token);
};
