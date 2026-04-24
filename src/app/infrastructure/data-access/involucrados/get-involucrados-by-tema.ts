import { GetInvolucradosByTemaUseCase } from "@/app/application/use-cases/involucrados/get-involucrados-by-tema.use-case";
import { TemaInvolucrado } from "@/app/domain/entities";
import { InvolucradosRepositoryHttpImplementation } from "../../repositories/involucrados.repository.http.implementation";

export const getInvolucradosByTema = async (idTema: number, token: string): Promise<TemaInvolucrado[]> => {
  return new GetInvolucradosByTemaUseCase(new InvolucradosRepositoryHttpImplementation()).execute(idTema, token);
};
