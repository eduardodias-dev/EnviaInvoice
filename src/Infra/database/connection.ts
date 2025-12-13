import pgp from "pg-promise";

export interface DbConnection {
    query(query: string, data: any): Promise<any>;
    close(): Promise<any>;
}

export default class PostgresConnection implements DbConnection{
    private connection: pgp.IDatabase<{}>;
    constructor(){
        this.connection = pgp()("postgres://postgres:senha123@database:5432/db");
    }

    async query(query: string, data: any): Promise<any> {
        return await this.connection.query(query, data);
    }

    async close(): Promise<any> {
        await this.connection.$pool.end();
    }
}