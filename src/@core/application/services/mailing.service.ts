export type MailAttachment = {
	content?: string | Buffer;
	filename?: string;
	path?: string;
};

export type SendMailOptions = {
	from: string;
	to: string | string[];
	subject: string;
	attachments?: MailAttachment[];
	text: string;
	html?: string;
};

export abstract class MailingService {
	abstract sendMail(opts: SendMailOptions): Promise<void>;
}
