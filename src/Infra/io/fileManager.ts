import { readFile, writeFile } from 'fs/promises';

export interface FileManager {
    read(filePath: string): Promise<Buffer>;
    save(filePath: string, data: any): Promise<void>;
}

export class NodeFsFileManager implements FileManager {

    async read(filePath: string): Promise<Buffer> {
        return await readFile(filePath);
    }

    save(filePath: string, data: any): Promise<void> {
        return writeFile(filePath, data);
    }
}