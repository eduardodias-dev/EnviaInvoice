import PostgresConnection, { DbConnection } from "../src/Infra/connection";
import CreateInvoice from "../src/Application/CreateInvoice"
import InvoiceRepositoryDatabase from "../src/Infra/InvoiceRepositoryDatabase";
import InvoiceTemplateRepositoryExcel, { InvoiceTemplateRepository } from "../src/Infra/InvoiceTemplateRepository"
import { sleep } from "./InvoiceRepositoryDatabase.test";
import { InvoiceRepository } from "../src/Domain/InvoiceRepository";

let templateRepository: InvoiceTemplateRepository;
let connection: DbConnection;
let invoiceRepository: InvoiceRepository;
let createInvoice: CreateInvoice;

beforeAll(() => {
    templateRepository = new InvoiceTemplateRepositoryExcel();
    connection = new PostgresConnection();
    invoiceRepository = new InvoiceRepositoryDatabase(connection);
    createInvoice = new CreateInvoice(templateRepository, invoiceRepository);
});

test("Deve criar a invoice corretamente", async () => {
    const lastInserted = await invoiceRepository.getLastInvoiceNumber();
    await createInvoice.execute({value: 1000, date: new Date()});
    await sleep(100);
    const nextInserted = await invoiceRepository.getLastInvoiceNumber();
    expect(parseInt(nextInserted.number)).toBe(parseInt(lastInserted.number)+1);
});

afterAll(async () => {
    await connection.close();
})