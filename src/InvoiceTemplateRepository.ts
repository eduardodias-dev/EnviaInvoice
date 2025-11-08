import { Workbook } from "exceljs";
import Invoice from "./Invoice";

export interface InvoiceTemplateRepository {
    getTemplateData(filePath: string): Promise<any>;
    saveInvoice(templateFilePath: string, destinationFilePath: string, invoiceData: Invoice): Promise<any>;
}

export default class InvoiceTemplateRepositoryExcel implements InvoiceTemplateRepository {
    columnMaps = {
        invoiceNumber: "C11",
        poNumber: "C12",
        issueDate: "C13",
        dueDate: "C13",
        payee: {
            socialName: "C5",
            address: "C6",
            cityState: "C7",
            country: "C8",
        },
        payer: {
            name: "F5",
            address: "F6",
            contactName: "F7",
            email: "F8",
        },
        bankData: {
            paymentMethod: "C27",
            bankDetails: "C28",
        },
        total: "F24"
    }

    async saveInvoice(templateFilePath: string, destinationFilePath: string, invoiceData: Invoice): Promise<any> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(templateFilePath);
        const sheet = workbook.getWorksheet(1);

        if (!sheet) throw new Error("Sheet not found");
        sheet.getCell(this.columnMaps.invoiceNumber).value = invoiceData.getInvoiceNumber();
        sheet.getCell(this.columnMaps.poNumber).value = invoiceData.getPONumber();
        sheet.getCell(this.columnMaps.issueDate).value = invoiceData.getDate();
        sheet.getCell(this.columnMaps.dueDate).value = invoiceData.getDate();

        sheet.getCell("B18").value = 1;
        sheet.getCell("C18").value = invoiceData.getServiceDescription();
        sheet.getCell("E18").value = invoiceData.getValue();
        sheet.getCell("F18").value = invoiceData.getValue();
        sheet.getCell("E24").value = invoiceData.getValue();
        sheet.getCell("F24").value = invoiceData.getValue();

        await workbook.xlsx.writeFile(destinationFilePath);
    }

    async getTemplateData(filePath: string): Promise<any> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.getWorksheet(1);
        const payerData = {
            name: sheet?.getCell(this.columnMaps.payer.name).text,
            address: sheet?.getCell(this.columnMaps.payer.address).text,
            contactName: sheet?.getCell(this.columnMaps.payer.contactName).text,
            email: sheet?.getCell(this.columnMaps.payer.email).text,
        }

        const payeeData = {
            socialName: sheet?.getCell(this.columnMaps.payee.socialName).text,
            address: sheet?.getCell(this.columnMaps.payee.address).text,
            cityState: sheet?.getCell(this.columnMaps.payee.cityState).text,
            country: sheet?.getCell(this.columnMaps.payee.country).text,
        }

        const bankData = {
            paymentMethod: sheet?.getCell(this.columnMaps.bankData.paymentMethod).text,
            bankDetails: sheet?.getCell(this.columnMaps.bankData.bankDetails).text
        }

        const items = [];

        for(let row = 18; row <= 23; row++){
            const quantity = sheet?.getCell("B"+row).text;
            if(!quantity) continue;
            items.push({
                quantity,
                description: sheet.getCell("C"+row).text,
                unitPrice: sheet.getCell("E"+row).text,
                itemTotal: sheet.getCell("F"+row).text,
            })
        }
        
        const invoiceInstanceData = {
            invoiceNumber: sheet?.getCell(this.columnMaps.invoiceNumber).text,
            poNumber: sheet?.getCell(this.columnMaps.poNumber).text,
            issueDate: (sheet?.getCell(this.columnMaps.issueDate).value as Date).toLocaleDateString("pt-br"),
            dueDate: (sheet?.getCell(this.columnMaps.dueDate).value as Date).toLocaleDateString("pt-br"),
            total: sheet?.getCell(this.columnMaps.total).text,
            items
        }

        return { payerData, payeeData, bankData, invoiceInstanceData }
    }
}