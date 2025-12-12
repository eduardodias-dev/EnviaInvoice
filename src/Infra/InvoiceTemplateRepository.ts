import { Workbook } from "exceljs";
import TemplateData from "../Domain/TemplateData";
import Invoice from "../Domain/Invoice";
import { columnMaps } from "../Domain/ColumnMaps";
import { readFile } from "fs/promises";

export interface InvoiceTemplateRepository {
    getTemplateData(filePath: string): Promise<TemplateData>;
    saveInvoice(templateFilePath: string, destinationFilePath: string, invoiceData: Invoice): Promise<any>;
    getInvoiceFile(filePath: string): Promise<Buffer | string>;
}

export default class InvoiceTemplateRepositoryExcel implements InvoiceTemplateRepository {
    async getInvoiceFile(filePath: string): Promise<Buffer | string> {
        return await readFile(filePath);
    }

    async saveInvoice(templateFilePath: string, destinationFilePath: string, invoiceData: Invoice): Promise<any> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(templateFilePath);
        const sheet = workbook.getWorksheet(1);

        if (!sheet) throw new Error("Sheet not found");
        sheet.getCell(columnMaps.invoiceNumber).value = invoiceData.getInvoiceNumber();
        sheet.getCell(columnMaps.poNumber).value = invoiceData.getPONumber();
        sheet.getCell(columnMaps.issueDate).value = invoiceData.getDate();
        sheet.getCell(columnMaps.dueDate).value = invoiceData.getDate();

        sheet.getCell("B18").value = 1;
        sheet.getCell("C18").value = invoiceData.getServiceDescription();
        sheet.getCell("E18").value = invoiceData.getValue();
        sheet.getCell("F18").value = invoiceData.getValue();
        sheet.getCell("E24").value = invoiceData.getValue();
        sheet.getCell("F24").value = invoiceData.getValue();

        await workbook.xlsx.writeFile(destinationFilePath);
    }

    async getTemplateData(filePath: string): Promise<TemplateData> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.getWorksheet(1);
        const payerData = {
            name: sheet?.getCell(columnMaps.payer.name).text,
            address: sheet?.getCell(columnMaps.payer.address).text,
            contactName: sheet?.getCell(columnMaps.payer.contactName).text,
            email: sheet?.getCell(columnMaps.payer.email).text,
        }

        const payeeData = {
            socialName: sheet?.getCell(columnMaps.payee.socialName).text,
            address: sheet?.getCell(columnMaps.payee.address).text,
            cityState: sheet?.getCell(columnMaps.payee.cityState).text,
            country: sheet?.getCell(columnMaps.payee.country).text,
        }

        const bankData = {
            paymentMethod: sheet?.getCell(columnMaps.bankData.paymentMethod).text,
            bankDetails: sheet?.getCell(columnMaps.bankData.bankDetails).text
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
        
        const invoiceData = {
            invoiceNumber: sheet?.getCell(columnMaps.invoiceNumber).text,
            poNumber: sheet?.getCell(columnMaps.poNumber).text,
            issueDate: (sheet?.getCell(columnMaps.issueDate).value as Date).toLocaleDateString("pt-br"),
            dueDate: (sheet?.getCell(columnMaps.dueDate).value as Date).toLocaleDateString("pt-br"),
            total: sheet?.getCell(columnMaps.total).text,
            items
        }

        return { payerData, payeeData, bankData, invoiceData }
    }
}