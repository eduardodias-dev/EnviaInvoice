export default class Payee{
    constructor(readonly socialName: string, readonly address: string, 
        readonly cityState: string, readonly country: string
    ){

    }

    validate() : boolean{
        return true;
    }
}