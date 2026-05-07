import { emailparamDto } from "@/app/domain/dtos/emailparamDto";

export interface sendEmailRepository {
  sendEmail(emailparam: emailparamDto): Promise<any>;
}
