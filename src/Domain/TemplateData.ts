export default class TemplateData {
    constructor(readonly payerData: PayerData, readonly payeeData: PayeeData, readonly bankData: BankData,
        readonly invoiceData: InvoiceData 
    ){}
}

type PayerData = {
    name: string | undefined,
    address: string | undefined,
    contactName: string | undefined,
    email: string | undefined,
}

type PayeeData = {
    socialName: string | undefined,
    address: string | undefined,
    cityState: string | undefined,
    country: string | undefined
}

type BankData = {
    paymentMethod: string | undefined,
    bankDetails: string | undefined
}

type InvoiceData = {
    invoiceNumber: string | undefined,
    poNumber: string | undefined,
    issueDate: string | undefined,
    dueDate: string | undefined,
    total: string | undefined
    items: {
        quantity: string;
        description: string;
        unitPrice: string;
        itemTotal: string;
    }[]
}