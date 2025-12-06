import Invoice from "./Invoice";
import { InvoiceRepository } from "./InvoiceRepository";
import { InvoiceTemplateRepository } from "./InvoiceTemplateRepository";
import Payee from "./Payee";
import Payer from "./Payer";
import UUID from "./UUID";

export default class CreateInvoice{
    
    constructor(readonly templateRepository: InvoiceTemplateRepository, readonly invoiceRepository: InvoiceRepository){}

    async execute(input: any): Promise<any>{
        // pega o template, gera um novo número, gera o arquivo da invoice, salva no bd
        const templateFilePath = "./data/template_invoice.xlsx";
        const template = await this.templateRepository.getTemplateData(templateFilePath);
        const number = await this.invoiceRepository.getLastInvoiceNumber();
        const payee = new Payee(template.payeeData.socialName, template.payeeData.address, template.payeeData.cityState, template.payeeData.country);
        const payer = new Payer(template.payerData.name, template.payerData.address, template.payerData.contactName, template.payerData.email);
        const invoice = new Invoice(UUID.generate(), parseInt(number.number)+1, input.value, input.date, payee, payer);
        const invoiceFileName = `invoice_${invoice.getRawNumber()}_${invoice.getDate().getFullYear()}`;
        await this.templateRepository.saveInvoice(templateFilePath, `./data/${invoiceFileName}.xlsx`, invoice);
        await this.invoiceRepository.addInvoice(invoice);
    }
}