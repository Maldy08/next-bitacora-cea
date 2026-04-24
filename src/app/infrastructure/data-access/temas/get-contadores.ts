import { GetContadoresUseCase } from "@/app/application/use-cases/temas/get-contadores.use-case";
import { TemaContadoresDto } from "@/app/domain/dtos";
import { TemasRepositoryHttpImplementation } from "../../repositories/temas.repository.http.implementation";

export const getContadores = async (token: string): Promise<TemaContadoresDto> => {
  return new GetContadoresUseCase(new TemasRepositoryHttpImplementation()).execute(token);
};
