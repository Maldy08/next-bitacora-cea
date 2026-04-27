import { IAvancesRepository } from "@/app/application/interfaces";

export class UpdateAvanceUseCase {
  constructor(private repo: IAvancesRepository) {}

  async execute(id: number, observaciones: string, token: string): Promise<boolean> {
    return this.repo.update(id, observaciones, token);
  }
}
