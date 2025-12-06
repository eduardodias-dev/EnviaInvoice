import InvoiceEmailSender, { InvoiceObserver } from "../Domain/InvoiceObserver";
import { InvoiceRepository } from "../Domain/InvoiceRepository";

export default class CompleteAndSendInvoice {
    constructor(readonly invoiceRepository: InvoiceRepository, readonly observers: InvoiceObserver[]){}

    async execute(data: {number: number}): Promise<any>{
        const invoice = await this.invoiceRepository.getInvoiceByNumber(data.number);
        for(let observer of this.observers){
            invoice?.addObserver(observer);
        }
        await invoice?.complete();
    }
}