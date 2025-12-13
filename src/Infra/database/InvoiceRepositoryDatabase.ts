import Invoice from "../../Domain/Invoice";
import { InvoiceRepository } from "../../Domain/InvoiceRepository";
import Payee from "../../Domain/Payee";
import Payer from "../../Domain/Payer";
import UUID from "../../Domain/UUID";
import { DbConnection } from "./connection";

export default class InvoiceRepositoryDatabase implements InvoiceRepository{
    constructor(readonly connection: DbConnection){}

    async getLastInvoiceNumber(): Promise<number> {
        const [result] = await this.connection.query("SELECT number from envia_invoice.invoices order by number desc limit 1", []);
        return !result || !result.number ? 0 : result.number;
    }

    async addInvoice(invoice: Invoice): Promise<any> {
        await this.connection.query(
            `INSERT INTO envia_invoice.invoices (id, number, value, invoice_date, payee_name, payee_address, payee_city_state, payee_country, payer_name, payer_address, payer_contact_name, payer_email)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                invoice.getId(),
                invoice.getRawNumber(),
                invoice.getValue(),
                invoice.getDate().toISOString(),
                invoice.getPayeeName(),
                invoice.getPayeeAddress(),
                invoice.getPayeeCity(),
                invoice.getPayeeCountry(),
                invoice.getPayerName(),
                invoice.getPayerAddress(),
                invoice.getPayerContactName(),
                invoice.getPayerEmail()
            ]);
    }

    async getInvoiceByNumber(number: number): Promise<Invoice | undefined> {
        const [invoice] = await this.connection.query("SELECT * from envia_invoice.invoices WHERE number = $1", [number]);
        if(!invoice) throw new Error("Invoice not Found");

        return new Invoice(new UUID(invoice.id), invoice.number, invoice.value, invoice.invoice_date, new Payee(invoice.payee_name, invoice.payee_address, invoice.payee_city_state, invoice.payee_country), new Payer(invoice.payer_name, invoice.payer_address, invoice.payer_contact_name, invoice.payer_email)) 
    }
}