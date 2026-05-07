export interface emailparamDto {
  email_to?: string;
  email_subject: string;
  email_body: string;
  email_from: string;
  email_from_name?: string;
  email_cc?: string[];
  email_attachment?: File;
}
