import InvoiceTemplateRepositoryExcel from '../src/InvoiceTemplateRepository';

test("Deve Ler dados do Pagador do arquivo xlsx", async () => {
    const templateRepository = new InvoiceTemplateRepositoryExcel();
    const data = await templateRepository.getTemplateData("./data/template_invoice.xlsx");

    expect(data.payerData).toBeDefined();
    expect(data.payerData.name).toBe("TravelConfirm, Inc., d/b/a Dev.Pro");
    expect(data.payerData.address).toBe("7260 W. Azure Dr Suite 140-829, Las Vegas, NV 89130");
    expect(data.payerData.contactName).toBe("Jeff Bianco");
    expect(data.payerData.email).toBe("ww@dev.pro");
});

test("Deve Ler dados do Recebedor do arquivo xlsx", async () => {
    const templateRepository = new InvoiceTemplateRepositoryExcel();
    const data = await templateRepository.getTemplateData("./data/template_invoice.xlsx");

    expect(data.payeeData).toBeDefined();
    expect(data.payeeData.socialName).toBe("EDUARDO JOSE DE OLIVEIRA DIAS TECNOLOGIA DA INFORMACAO LTDA");
    expect(data.payeeData.address).toBe("Rua das Sempre-Vivas, 181 ap. 201 bloco 5, Sapucaia");
    expect(data.payeeData.cityState).toBe("Contagem/MG");
    expect(data.payeeData.country).toBe("Brasil");
});

test("Deve Ler dados Bancários do arquivo xlsx", async () => {
    const templateRepository = new InvoiceTemplateRepositoryExcel();
    const data = await templateRepository.getTemplateData("./data/template_invoice.xlsx");

    expect(data.bankData).toBeDefined();
    expect(data.bankData.paymentMethod).toBe("Remessa Online");
    expect(data.bankData.bankDetails).toBe("Banco BS2 S.A. - Ag: 0001-9 - CC: 10122630");
});

test("Deve Ler dados da invoice do arquivo xlsx", async () => {
    const templateRepository = new InvoiceTemplateRepositoryExcel();
    const data = await templateRepository.getTemplateData("./data/template_invoice.xlsx");

    expect(data.invoiceInstanceData).toBeDefined();
    expect(data.invoiceInstanceData.invoiceNumber).toBe("0088/2025");
    expect(data.invoiceInstanceData.poNumber).toBe("88");
    expect(data.invoiceInstanceData.issueDate).toBe("24/10/2025");
    expect(data.invoiceInstanceData.dueDate).toBe("24/10/2025");
    expect(data.invoiceInstanceData.total).toBe("3283");
    expect(data.invoiceInstanceData.items).toHaveLength(1);
});

test("Deve Ler dados dos itens da invoice do arquivo xlsx", async () => {
    const templateRepository = new InvoiceTemplateRepositoryExcel();
    const data = await templateRepository.getTemplateData("./data/template_invoice.xlsx");
    expect(data.invoiceInstanceData).toBeDefined();
    const items = data.invoiceInstanceData.items
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe("1");
    expect(items[0].description).toBe("Payment for software development services");
    expect(items[0].unitPrice).toBe("3283");
    expect(items[0].itemTotal).toBe("3283");
});