import { create } from "domain";
import PostgresConnection, { DbConnection } from "../src/connection";
import CreateInvoice from "../src/CreateInvoice"
import InvoiceRepositoryDatabase from "../src/InvoiceRepositoryDatabase";
import InvoiceTemplateRepositoryExcel, { InvoiceTemplateRepository } from "../src/InvoiceTemplateRepository"
import { sleep } from "./InvoiceRepositoryDatabase.test";
import { InvoiceRepository } from "../src/InvoiceRepository";
import { after } from "node:test";

let templateRepository: InvoiceTemplateRepository;
let connection: DbConnection;
let invoiceRepository: InvoiceRepository;

beforeEach(async () => {
    templateRepository = new InvoiceTemplateRepositoryExcel();
    connection = new PostgresConnection();
    invoiceRepository = new InvoiceRepositoryDatabase(connection);
})

test("Deve criar a invoice corretamente", async () => {
    const createInvoice = new CreateInvoice(templateRepository, invoiceRepository);

    const lastInserted = await invoiceRepository.getLastInvoiceNumber();
    await createInvoice.execute({value: 1000, date: new Date()});
    await sleep(100);
    const nextInserted = await invoiceRepository.getLastInvoiceNumber();
    expect(parseInt(nextInserted.number)).toBe(parseInt(lastInserted.number)+1);
});

afterAll(async () => {
    await connection.close();
})