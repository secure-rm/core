/// <reference types="node" />

type Callback = (err: NodeJS.ErrnoException | null, path: string) => void
interface FileInfo {
  file: string;
  fileSize: number;
}
interface ForInterface {
  start: number;
  end: number;
  increment: number;
}

declare function srm(path: string): Promise<string>;
declare function srm(path: string, options: Options): Promise<string>;
declare function srm(path: string, callback: Callback): void;
declare function srm(path: string, options: Options, callback: Callback): void;

declare namespace srm {
    const write: {
        init: (file: string) => Promise<FileInfo>;
        random: (file: string, fileSize: number, passes?: number) => Promise<FileInfo>;
        zeroes: (file: string, fileSize: number, passes?: number) => Promise<FileInfo>;
        ones: (file: string, fileSize: number, passes?: number) => Promise<FileInfo>;
        byte: (file: string, data: number, fileSize: number, passes?: number) => Promise<FileInfo>;
        bytes: (file: string, dataArray: number[], fileSize: number, passes?: number) => Promise<FileInfo>;
        cycleBytes: (file: string, dataArray: number[], fileSize: number, passes?: number) => Promise<FileInfo>;
        incrementByte: (file: string, { start, end, increment }: ForInterface, fileSize: number) => Promise<FileInfo>;
        randomByte: (file: string, fileSize: number, passes?: number) => Promise<FileInfo>;
        complementary: (file: string, fileSize: number) => Promise<FileInfo>;
        rename: (file: string, fileSize: number) => Promise<FileInfo>;
        truncate: (file: string, fileSize: number) => Promise<FileInfo>;
        unlink: (file: string) => Promise<void>;
    }
    let event: events.EventEmitter;
}