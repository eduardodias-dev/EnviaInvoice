import Invoice from "../src/Invoice";
import Payee from "../src/Payee";
import Payer from "../src/Payer";
import UUID from "../src/UUID";

test("A invoice deverá ser enviada com o valor, o número, e a data corretos", () => {
    const date = new Date();
    const invoice = new Invoice(UUID.generate(), 1, 1000.00, date);
    expect(invoice.number).toBe(1);
    expect(invoice.date).toBe(date);
    expect(invoice.value).toBe(1000.00);
});

test("A Invoice deverá conter dados do recebedor", () => {
    const payee = new Payee("Razao Social", "Rua das Teste, 123 - Bairro", "Belo Horizonte/MG", "Brasil");
    const invoice = new Invoice(UUID.generate(), 1, 1000.00, new Date(), payee);
    expect(invoice.getPayeeAddress()).toBe("Rua das Teste, 123 - Bairro");
    expect(invoice.getPayeeName()).toBe("Razao Social");
    expect(invoice.getPayeeCity()).toBe("Belo Horizonte/MG");
    expect(invoice.getPayeeCountry()).toBe("Brasil");
});

test("A Invoice deverá conter dados do pagador", () => {
    const payer = new Payer("Cliente 1", "Some Street in Usa, New York, NY", "John Doe", "ww@test.com");
    const invoice = new Invoice(UUID.generate(), 1, 1000.00, new Date(), undefined, payer);
    expect(invoice.getPayerAddress()).toBe("Some Street in Usa, New York, NY");
    expect(invoice.getPayerName()).toBe("Cliente 1");
    expect(invoice.getPayerContactName()).toBe("John Doe");
    expect(invoice.getPayerEmail()).toBe("ww@test.com");
});

test("Invoice Number deve ser no formato correto", async () => {
    const date = new Date();
    const invoice = new Invoice(UUID.generate(), 1, 1000.00, date, undefined, undefined);

    expect(invoice.getInvoiceNumber()).toBe(`0001/${date.getFullYear()}`);
});

test("Complete deve bloquear invoice de completar com número inválido", () => {
    const invoice = new Invoice(UUID.generate(), 0, 1000.00, new Date(), undefined, undefined);

    expect(async() => await invoice.complete()).rejects.toThrow("Invoice number is invalid");
});

test("Complete deve bloquear invoice de completar com valor inválido", () => {
    const invoice = new Invoice(UUID.generate(), 1, -100.00, new Date(), undefined, undefined);

    expect(async () => await invoice.complete()).rejects.toThrow("Invoice value is invalid");
});

test("Complete deve bloquear invoice de completar com Payee inválido", () => {
    const invoice = new Invoice(UUID.generate(), 1, 100.00, new Date(), undefined, new Payer("test", "test", "test", "test"));

    expect(async () => await invoice.complete()).rejects.toThrow("Payee data is invalid");
});

test("Complete deve bloquear invoice de completar com Payer inválido", () => {
    const invoice = new Invoice(UUID.generate(), 1, 100.00, new Date(), new Payee("test", "test", "test", "test"), undefined);

    expect(async () => await invoice.complete()).rejects.toThrow("Payer data is invalid");
});

test("Complete deve completar corretamente.", async () => {
    const invoice = new Invoice(UUID.generate(), 1, 100.00, new Date(), new Payee("test", "test", "test", "test"), new Payer("test", "test", "test", "test"));
    await invoice.complete();
    expect(invoice.isCompleted()).toBe(true);
});