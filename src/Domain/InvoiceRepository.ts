import Invoice from "./Invoice";

export interface InvoiceRepository {
    getLastInvoiceNumber(): Promise<any>;
    addInvoice(data: Invoice): Promise<any>;
    getInvoiceByNumber(number: number): Promise<Invoice | undefined>;
}

export class InvoiceRepositoryMemory implements InvoiceRepository {
    private invoices: Invoice[] = [];

    getLastInvoiceNumber(): Promise<any> {
        const ordered = this.invoices.sort((a, b) => b.getRawNumber() - a.getRawNumber());
        
        return Promise.resolve(ordered[0].getRawNumber());
    }

    addInvoice(data: Invoice): Promise<any> {
        this.invoices.push(data);
        return Promise.resolve();
    }

    async getInvoiceByNumber(number: number): Promise<Invoice> {
        const invoices = this.invoices.filter(i => i.getRawNumber() == number);
        const invoice = invoices[0];
        if(!invoice) throw new Error("Invoice not Found");

        return Promise.resolve(invoice);
    }
}