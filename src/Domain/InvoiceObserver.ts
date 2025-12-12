import Payee from "./Payee";
import Payer from "./Payer";
import UUID from "./UUID";
import {EmailAdapter} from "../Infra/EmailAdapter";
import {InvoiceTemplateRepository} from "../Infra/InvoiceTemplateRepository";
export interface InvoiceObserver {
    notify(data: InvoiceObserverInput): Promise<any>;
}

export default class InvoiceEmailSender implements InvoiceObserver {
    constructor(private emailAdapter: EmailAdapter, private invoiceTemplateRepository: InvoiceTemplateRepository) {
    }

    async notify(data: InvoiceObserverInput): Promise<any> {
        const filePath = `./data/${data.fileName}.xlsx`;
        const template = await this.invoiceTemplateRepository.getInvoiceFile(filePath);
        let attachments: { filename: string, content: Buffer | string, contentType: string }[] = [];
        if (template && template.length > 0) {
            attachments?.push({
                filename: `${data.fileName}.xlsx`,
                content: template,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            })
        }

        await this.emailAdapter.send("testClient@test.com", "testSender@test.com",
            "Invoice Completed Successfully", data, attachments );
    }
}

export type InvoiceObserverInput = {
    id: UUID, 
    number: number, 
    value: number, 
    date: Date, 
    payee?: Payee, 
    payer?: Payer,
    fileName: string,
}