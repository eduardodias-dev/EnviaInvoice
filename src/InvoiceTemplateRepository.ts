import { Workbook } from "exceljs";

export interface InvoiceTemplateRepository {
    getTemplateData(filePath: string): Promise<any>;
}

export default class InvoiceTemplateRepositoryExcel implements InvoiceTemplateRepository {
    async getTemplateData(filePath: string): Promise<any> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.getWorksheet(1);
        const payerData = {
            name: sheet?.getCell("F5").text,
            address: sheet?.getCell("F6").text,
            contactName: sheet?.getCell("F7").text,
            email: sheet?.getCell("F8").text,
        }

        const payeeData = {
            socialName: sheet?.getCell("C5").text,
            address: sheet?.getCell("C6").text,
            cityState: sheet?.getCell("C7").text,
            country: sheet?.getCell("C8").text,
        }

        const bankData = {
            paymentMethod: sheet?.getCell("C27").text,
            bankDetails: sheet?.getCell("C28").text
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
            invoiceNumber: sheet?.getCell("C11").text,
            poNumber: sheet?.getCell("C12").text,
            issueDate: (sheet?.getCell("C13").value as Date).toLocaleDateString("pt-br"),
            dueDate: (sheet?.getCell("C14").value as Date).toLocaleDateString("pt-br"),
            total: sheet?.getCell("F24").text,
            items
        }

        return { payerData, payeeData, bankData, invoiceInstanceData }
    }
}