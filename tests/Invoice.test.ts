import Invoice from "../src/Invoice";
import Payee from "../src/Payee";
import Payer from "../src/Payer";

test("A invoice deverá ser enviada com o valor, o número, e a data corretos", () => {
    const date = new Date();
    const invoice = new Invoice(0, 1, 1000.00, date);
    expect(invoice.number).toBe(1);
    expect(invoice.date).toBe(date);
    expect(invoice.value).toBe(1000.00);
});

test("A Invoice deverá conter dados do recebedor", () => {
    const payee = new Payee("Razao Social", "Rua das Teste, 123 - Bairro", "Belo Horizonte/MG", "Brasil");
    const invoice = new Invoice(1, 1, 1000.00, new Date(), payee);
    expect(invoice.getPayeeAddress()).toBe("Rua das Teste, 123 - Bairro");
    expect(invoice.getPayeeName()).toBe("Razao Social");
    expect(invoice.getPayeeCity()).toBe("Belo Horizonte/MG");
    expect(invoice.getPayeeCountry()).toBe("Brasil");
});

test("A Invoice deverá conter dados do pagador", () => {
    const payer = new Payer("Cliente 1", "Some Street in Usa, New York, NY", "John Doe", "ww@test.com");
    const invoice = new Invoice(1, 1, 1000.00, new Date(), undefined, payer);
    expect(invoice.getPayerAddress()).toBe("Some Street in Usa, New York, NY");
    expect(invoice.getPayerName()).toBe("Cliente 1");
    expect(invoice.getPayerContactName()).toBe("John Doe");
    expect(invoice.getPayerEmail()).toBe("ww@test.com");
});

