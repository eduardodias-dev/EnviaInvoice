import "reflect-metadata";
import Container from "typedi";
import CompleteAndSendInvoice from "../src/Application/CompleteAndSendInvoice";
import InvoiceEmailSender from "../src/Domain/InvoiceObserver";
import { InvoiceRepository } from "../src/Domain/InvoiceRepository";
import NodeMailerAdapter from "../src/Infra/email/EmailAdapter";
import InvoiceRepositoryDatabase from "../src/Infra/database/InvoiceRepositoryDatabase";
import PostgresConnection, {DbConnection} from "../src/Infra/database/connection";
import { sleep } from "./util";
import {FileManager, NodeFsFileManager} from "../src/Infra/io/fileManager";

let repository: InvoiceRepository;
let completeAndSendInvoice: CompleteAndSendInvoice;
let fileManager: FileManager;
let connection: DbConnection;

beforeEach(async () => {
    connection = new PostgresConnection();
    repository = new InvoiceRepositoryDatabase(connection);
    fileManager = new NodeFsFileManager();

    const emailObserver = new InvoiceEmailSender(new NodeMailerAdapter(), fileManager);

    Container.set("invoiceRepository", repository);
    Container.set("invoice.observers", [emailObserver]);
    
    completeAndSendInvoice = Container.get(CompleteAndSendInvoice);
});

test("Deve notificar ao completar invoice", async () => {
    const number = await repository.getLastInvoiceNumber();
    await completeAndSendInvoice.execute({ number: number });

    await sleep(1000);
});