import Invoice from "./Invoice";

export interface InvoiceRepository {
    getLastInvoiceNumber(): Promise<any>;
    addInvoice(data: Invoice): Promise<any>;
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
}