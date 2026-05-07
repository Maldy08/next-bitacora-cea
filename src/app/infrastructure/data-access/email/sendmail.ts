"use client";

import { SendMailUseCase } from "@/app/application/use-cases/email/send-mail.use-case";
import { SendMailRepositoryHttpImplementation } from "../../repositories/sendmail.http.implementation";
import { emailparamDto } from "@/app/domain/dtos/emailparamDto";

export async function sendEmail(emailparam: emailparamDto): Promise<any> {
  const sendEmailUc = new SendMailUseCase(new SendMailRepositoryHttpImplementation());
  return await sendEmailUc.execute(emailparam);
}
