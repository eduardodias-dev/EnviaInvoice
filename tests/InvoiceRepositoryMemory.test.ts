import Invoice from "../src/Invoice";
import { InvoiceRepositoryMemory } from "../src/InvoiceRepository"
import UUID from "../src/UUID";

test("Deve retornar o último número da invoice corretament", async () => {
    const repository = new InvoiceRepositoryMemory();

    await repository.addInvoice(new Invoice(UUID.generate(), 1, 100, new Date()))
    await repository.addInvoice(new Invoice(UUID.generate(), 2, 100, new Date()))
    await repository.addInvoice(new Invoice(UUID.generate(), 3, 100, new Date()))
    await repository.addInvoice(new Invoice(UUID.generate(), 4, 100, new Date()))

    const lastInserted = await repository.getLastInvoiceNumber();
    expect(lastInserted).toBe(4)
});