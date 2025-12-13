import Invoice from "../src/Domain/Invoice";
import Payee from "../src/Domain/Payee";
import Payer from "../src/Domain/Payer";
import UUID from "../src/Domain/UUID";
import PostgresConnection, { DbConnection } from "../src/Infra/database/connection";
import InvoiceRepositoryDatabase from "../src/Infra/database/InvoiceRepositoryDatabase";
import { sleep } from './util';

let connection: DbConnection;
let repository: InvoiceRepositoryDatabase;
let defaultPayee: Payee;
let defaultPayer: Payer;

beforeEach(async () => {
    connection = new PostgresConnection();
    repository = new InvoiceRepositoryDatabase(connection);

    defaultPayee = new Payee("test payee", "test address payee", "BH/MG", "Brasil");
    defaultPayer = new Payer("test payer", "test address payer", "John Doe", "test@foo.bar");

    // await connection.truncate();
})

test.skip("Deve retornar o último número da invoice corretamente", async () => {
    const number = await repository.getLastInvoiceNumber();

    await repository.addInvoice(new Invoice(UUID.generate(), number+1, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);
    await repository.addInvoice(new Invoice(UUID.generate(), number+2, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);
    await repository.addInvoice(new Invoice(UUID.generate(), number+3, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);
    await repository.addInvoice(new Invoice(UUID.generate(), number+4, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);

    const nextInserted = await repository.getLastInvoiceNumber();
    expect(nextInserted).toBe(number+4)
});

afterAll(async () => {
    await connection.close();
})