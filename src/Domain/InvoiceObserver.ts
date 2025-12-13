import Payee from "./Payee";
import Payer from "./Payer";
import UUID from "./UUID";
import {EmailAdapter} from "../Infra/email/EmailAdapter";
import {FileManager} from "../Infra/io/fileManager";

export interface InvoiceObserver {
    notify(data: InvoiceObserverInput): Promise<any>;
}

export default class InvoiceEmailSender implements InvoiceObserver {

    readonly months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    constructor(private emailAdapter: EmailAdapter, private fileManager: FileManager) {}

    async notify(data: InvoiceObserverInput): Promise<any> {
        const filePath = `./data/${data.fileName}.xlsx`;
        const template = await this.fileManager.read(filePath);
        let attachments: { filename: string, content: Buffer | string, contentType: string }[] = [];
        if (template && template.length > 0) {
            attachments?.push({
                filename: `${data.fileName}.xlsx`,
                content: template,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            })
        }

        await this.emailAdapter.send("testClient@test.com", "testSender@test.com",
            `Emissão de NF para invoice ${data.number} - ${this.months[data.date.getMonth()]}`, this.getEmailHtml(data), attachments );
    }

    private getEmailHtml(data: InvoiceObserverInput){
        const greeting = new Date().getHours() < 12 ? "Bom Dia" : "Boa Tarde";

        return `${greeting}!<br />
<br />
Segue em anexo a Invoice nº ${data.number} referente ao recebimento de serviços de desenvolvimento de software.<br />
<br />
Favor gerar a Nota Fiscal. <br />
Qualquer dúvida, estou à disposição.<br />`;
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