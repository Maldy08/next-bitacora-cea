import { DeleteTemaUseCase } from "@/app/application/use-cases/temas/delete-tema.use-case";
import { TemasRepositoryHttpImplementation } from "../../repositories/temas.repository.http.implementation";

export const deleteTema = async (id: number, token: string): Promise<boolean> => {
  return new DeleteTemaUseCase(new TemasRepositoryHttpImplementation()).execute(id, token);
};
