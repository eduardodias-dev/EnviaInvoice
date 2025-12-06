
import Invoice from "../Domain/Invoice";
import { InvoiceRepository } from "../Domain/InvoiceRepository";
import UUID from "../Domain/UUID";
import { InvoiceTemplateRepository } from "../Infra/InvoiceTemplateRepository";


export default class CreateInvoice{
    
    constructor(readonly templateRepository: InvoiceTemplateRepository, readonly invoiceRepository: InvoiceRepository){}

    async execute(input: any): Promise<any>{
        // pega o template, gera um novo número, gera o arquivo da invoice, salva no bd
        const templateFilePath = "./data/template_invoice.xlsx";
        const template = await this.templateRepository.getTemplateData(templateFilePath);
        const number = await this.invoiceRepository.getLastInvoiceNumber();
        const invoice = Invoice.generateFromTemplate(UUID.generate(), parseInt(number.number)+1, input.value, input.date, template);
        
        await this.templateRepository.saveInvoice(templateFilePath, `./data/${invoice.getFileName()}.xlsx`, invoice);
        await this.invoiceRepository.addInvoice(invoice);
    }
}