import { emailparamDto } from "@/app/domain/dtos/emailparamDto";

export class SendMailMapper {
  static mapFromDomainToApi(sendmail: emailparamDto): Record<string, any> {
    return {
      To: sendmail.email_to,
      Subject: sendmail.email_subject,
      Body: sendmail.email_body,
      From: sendmail.email_from,
      FromName: sendmail.email_from_name,
      Cc: sendmail.email_cc,
      Attachment: sendmail.email_attachment,
    };
  }
}
