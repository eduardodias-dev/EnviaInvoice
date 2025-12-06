import 'reflect-metadata';
import { Inject, Service } from "typedi";
import InvoiceEmailSender, { InvoiceObserver } from "../Domain/InvoiceObserver";
import { InvoiceRepository } from "../Domain/InvoiceRepository";

@Service()
export default class CompleteAndSendInvoice {
    @Inject("invoiceRepository")
    private invoiceRepository: InvoiceRepository | undefined;
    
    @Inject("invoice.observers")
    private observers: InvoiceObserver[] | undefined;

    constructor(){}

    async execute(data: {number: number}): Promise<any>{
        const invoice = await this.invoiceRepository!.getInvoiceByNumber(data.number);
        for(let observer of this.observers!){
            invoice?.addObserver(observer);
        }
        await invoice?.complete();
    }
}