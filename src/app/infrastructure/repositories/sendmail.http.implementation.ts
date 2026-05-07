import { DbAdapter } from "../adapters/db.adapter";
import { sendEmailRepository } from "@/app/application/interfaces/email.interface.repository";
import { SendMailMapper } from "../mappers/sendmail.mapper";
import { emailparamDto } from "@/app/domain/dtos/emailparamDto";

export class SendMailRepositoryHttpImplementation implements sendEmailRepository {
  async sendEmail(emailparam: emailparamDto): Promise<any> {
    try {
      const formData = new FormData();
      const data = SendMailMapper.mapFromDomainToApi(emailparam);

      formData.append("To", data.To);
      formData.append("Subject", data.Subject);
      formData.append("Body", data.Body);
      formData.append("From", data.From);

      if (data.FromName) {
        formData.append("FromName", data.FromName);
      }

      if (data.Cc !== undefined && Array.isArray(data.Cc)) {
        data.Cc.forEach((email: string) => {
          formData.append("Cc", email);
        });
      }

      if (data.Attachment !== undefined && data.Attachment) {
        formData.append("Attachment", data.Attachment);
      }

      const result = await DbAdapter.post("email", formData);
      return result;
    } catch (error) {
      console.error("Error creating email from repository:", error);
      throw new Error("Error creating email from repository");
    }
  }
}
