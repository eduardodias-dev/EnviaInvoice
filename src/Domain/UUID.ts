export default class UUID {
    constructor(readonly uuid: string){
        if(!this.validate(uuid)) 
            throw new Error("Invalid UUID.");
    }

    static generate(): UUID {
        return new UUID(crypto.randomUUID());
    }

    getValue() : string{
        return this.uuid;
    }

    private validate(value: string) : boolean {
        const UUID_SIMPLE_REGEX = /^\s*[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\s*$/;

        return UUID_SIMPLE_REGEX.test(value);
    }
}