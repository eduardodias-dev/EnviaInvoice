import { InvoiceObserver } from "./InvoiceObserver";
import Payee from "./Payee";
import Payer from "./Payer";
import UUID from "./UUID";

export default class Invoice{
    private observers: InvoiceObserver[] = [];
    private completed: boolean = false;
    constructor(readonly id: UUID, readonly number: number, readonly value: number, readonly date: Date, 
        readonly payee?: Payee, readonly payer?: Payer){
        
    }

    addObserver(observer: InvoiceObserver){
        this.observers.push(observer);
    }

    async complete() : Promise<any> {
        if (this.number <= 0) throw new Error("Invoice number is invalid");
        if (this.value <= 0) throw new Error("Invoice value is invalid");
        if (!this.payee || !this.payee.validate()) throw new Error("Payee data is invalid");
        if (!this.payer || !this.payer.validate()) throw new Error("Payer data is invalid");

        const input = {
            id: this.id, 
            number: this.number, 
            value: this.getValue(), 
            date: this.getDate(),
            payee: this.payee, 
            payer: this.payer
        };

        for(const observer of this.observers){
            observer.notify(input);
        }

        this.completed = true;
    }   

    getValue() : number {
        return this.value;
    }
    
    getDate() : Date {
        return this.date;
    }

    getServiceDescription(){
        return "Payment for software development services";
    }

    getRawNumber(): number {
        return this.number;
    }
    
    getInvoiceNumber() : string {
        return `${this.number.toString().padStart(4, "0")}/${this.date.getFullYear()}`;
    }

    getPONumber() : string {
        return `${this.number.toString()}`;
    }

    getPayeeAddress() : string | undefined {
        return this.payee?.address;
    }

    getPayeeName() : string | undefined {
        return this.payee?.socialName;
    }

    getPayeeCity() : string | undefined {
        return this.payee?.cityState
    }

    getPayeeCountry(): string | undefined {
        return this.payee?.country;
    }

    getPayerAddress() : string | undefined {
        return this.payer?.address;
    }

    getPayerName() : string | undefined {
        return this.payer?.name;
    }

    getPayerContactName() : string | undefined {
        return this.payer?.contactName
    }

    getPayerEmail(): string | undefined {
        return this.payer?.email;
    }

    isCompleted() : boolean{
        return this.completed;
    }

    getId(): string{
        return this.id.getValue();
    }
 }