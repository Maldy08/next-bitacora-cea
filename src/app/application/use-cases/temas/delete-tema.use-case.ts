import { ITemasRepository } from "@/app/application/interfaces";

export class DeleteTemaUseCase {
  constructor(private repo: ITemasRepository) {}

  async execute(id: number, token: string): Promise<boolean> {
    return this.repo.delete(id, token);
  }
}
