export default class Payer {
    constructor(readonly name: string, readonly address: string, readonly contactName: string, readonly email: string){}

    validate() : boolean {
        return true;
    }
}