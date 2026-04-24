import { IAvancesRepository } from "@/app/application/interfaces";

export class DeleteAvanceUseCase {
  constructor(private repo: IAvancesRepository) {}

  async execute(id: number, token: string): Promise<boolean> {
    return this.repo.delete(id, token);
  }
}
