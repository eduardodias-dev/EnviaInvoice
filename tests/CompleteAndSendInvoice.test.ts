import CompleteAndSendInvoice from "../src/Application/CompleteAndSendInvoice";
import Invoice from "../src/Domain/Invoice";
import InvoiceEmailSender from "../src/Domain/InvoiceObserver";
import { InvoiceRepository, InvoiceRepositoryMemory } from "../src/Domain/InvoiceRepository";
import Payee from "../src/Domain/Payee";
import Payer from "../src/Domain/Payer";
import UUID from "../src/Domain/UUID";

let repository: InvoiceRepository;
let defaultPayee: Payee;
let defaultPayer: Payer;
let completeAndSendInvoice: CompleteAndSendInvoice;

beforeEach(async () => {
    repository = new InvoiceRepositoryMemory();

    defaultPayee = new Payee("test payee", "test address payee", "BH/MG", "Brasil");
    defaultPayer = new Payer("test payer", "test address payer", "John Doe", "test@foo.bar");

    const emailObserver = new InvoiceEmailSender();
    completeAndSendInvoice = new CompleteAndSendInvoice(repository, [emailObserver]);
    // await connection.truncate();
});

test("Deve notificar ao completar invoice", async () => {
    const invoice = new Invoice(UUID.generate(), 1, 100, new Date(), defaultPayee, defaultPayer);
    await repository.addInvoice(invoice);
    expect(async () => await completeAndSendInvoice.execute({ number: 1 })).not.toThrow();
});