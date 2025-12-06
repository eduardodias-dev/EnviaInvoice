import Invoice from "../Domain/Invoice";
import { InvoiceRepository } from "../Domain/InvoiceRepository";
import { DbConnection } from "./connection";

export default class InvoiceRepositoryDatabase implements InvoiceRepository{
    constructor(readonly connection: DbConnection){}

    async getLastInvoiceNumber(): Promise<any> {
        const [result] = await this.connection.query("SELECT number from envia_invoice.invoices order by number desc limit 1", []);
        return result;
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

}