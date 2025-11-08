import Payee from "./Payee";
import Payer from "./Payer";

export default class Invoice{
    constructor(readonly id: number, readonly number: number, readonly value: number, readonly date: Date, readonly payee?: Payee, readonly payer?: Payer){
        
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
 }