import PostgresConnection, { DbConnection } from "../src/connection";
import Invoice from "../src/Invoice";
import InvoiceRepositoryDatabase from "../src/InvoiceRepositoryDatabase";
import Payee from "../src/Payee";
import Payer from "../src/Payer";
import UUID from "../src/UUID";

let connection: DbConnection;
let repository: InvoiceRepositoryDatabase;
let defaultPayee: Payee;
let defaultPayer: Payer;

export function sleep (time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

beforeEach(async () => {
    connection = new PostgresConnection();
    repository = new InvoiceRepositoryDatabase(connection);

    defaultPayee = new Payee("test payee", "test address payee", "BH/MG", "Brasil");
    defaultPayer = new Payer("test payer", "test address payer", "John Doe", "test@foo.bar");

    // await connection.truncate();
})

test("Deve retornar o último número da invoice corretamente", async () => {
    const lastInserted = await repository.getLastInvoiceNumber();
    let number = 0;
    if(lastInserted && lastInserted.number)
        number = lastInserted.number;
    await repository.addInvoice(new Invoice(UUID.generate(), number+1, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);
    await repository.addInvoice(new Invoice(UUID.generate(), number+2, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);
    await repository.addInvoice(new Invoice(UUID.generate(), number+3, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);
    await repository.addInvoice(new Invoice(UUID.generate(), number+4, 100, new Date(), defaultPayee, defaultPayer))
    await sleep(100);

    const nextInserted = await repository.getLastInvoiceNumber();
    expect(nextInserted.number).toBe(number+4)
});

afterAll(async () => {
    await connection.close();
})