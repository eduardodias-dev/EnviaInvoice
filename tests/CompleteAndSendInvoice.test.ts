import "reflect-metadata";
import Container from "typedi";
import CompleteAndSendInvoice from "../src/Application/CompleteAndSendInvoice";
import Invoice from "../src/Domain/Invoice";
import InvoiceEmailSender from "../src/Domain/InvoiceObserver";
import { InvoiceRepository, InvoiceRepositoryMemory } from "../src/Domain/InvoiceRepository";
import Payee from "../src/Domain/Payee";
import Payer from "../src/Domain/Payer";
import UUID from "../src/Domain/UUID";
import NodeMailerAdapter from "../src/Infra/EmailAdapter";
import InvoiceTemplateRepositoryExcel, {InvoiceTemplateRepository} from "../src/Infra/InvoiceTemplateRepository";
import InvoiceRepositoryDatabase from "../src/Infra/InvoiceRepositoryDatabase";
import PostgresConnection, {DbConnection} from "../src/Infra/connection";
import { sleep } from "./util";

let repository: InvoiceRepository;
let defaultPayee: Payee;
let defaultPayer: Payer;
let completeAndSendInvoice: CompleteAndSendInvoice;
let invoiceTemplateRepository: InvoiceTemplateRepository;
let connection: DbConnection;

beforeEach(async () => {
    connection = new PostgresConnection();
    repository = new InvoiceRepositoryDatabase(connection);
    defaultPayee = new Payee("test payee", "test address payee", "BH/MG", "Brasil");
    defaultPayer = new Payer("test payer", "test address payer", "John Doe", "test@foo.bar");
    invoiceTemplateRepository = new InvoiceTemplateRepositoryExcel();
    const emailObserver = new InvoiceEmailSender(new NodeMailerAdapter(), invoiceTemplateRepository);

    Container.set("invoiceRepository", repository);
    Container.set("invoice.observers", [emailObserver]);
    
    completeAndSendInvoice = Container.get(CompleteAndSendInvoice);
    // await connection.truncate();
});

test("Deve notificar ao completar invoice", async () => {
    const number = await repository.getLastInvoiceNumber();
    await completeAndSendInvoice.execute({ number: number });

    await sleep(1000);
});