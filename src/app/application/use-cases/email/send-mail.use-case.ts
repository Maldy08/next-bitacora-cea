import { emailparamDto } from "@/app/domain/dtos/emailparamDto";
import { sendEmailRepository } from "../../interfaces/email.interface.repository";

export class SendMailUseCase {
  constructor(private sendEmailRepository: sendEmailRepository) {}

  async execute(emailparam: emailparamDto): Promise<void> {
    return this.sendEmailRepository.sendEmail(emailparam);
  }
}
