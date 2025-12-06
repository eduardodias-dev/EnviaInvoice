import Payee from "./Payee";
import Payer from "./Payer";
import UUID from "./UUID";

export interface InvoiceObserver {
    notify(data: InvoiceObserverInput): Promise<any>;
}

export default class InvoiceEmailSender implements InvoiceObserver {
    notify(data: any): Promise<any> {
        console.log("Sending Email");
        return new Promise<any>((resolve) =>  resolve(data));
    }
}

export type InvoiceObserverInput = {
    id: UUID, 
    number: number, 
    value: number, 
    date: Date, 
    payee?: Payee, 
    payer?: Payer
}