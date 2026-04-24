import { UpdateTemaEstadoUseCase } from "@/app/application/use-cases/temas/update-tema-estado.use-case";
import { TemasRepositoryHttpImplementation } from "../../repositories/temas.repository.http.implementation";

export const updateTemaEstado = async (id: number, estado: string, token: string): Promise<boolean> => {
  return new UpdateTemaEstadoUseCase(new TemasRepositoryHttpImplementation()).execute(id, estado, token);
};
