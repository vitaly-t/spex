////////////////////////////////////////
// Requires SPEX v3.0.0 or later.
////////////////////////////////////////

declare namespace spex {

    interface IOriginData {
        success: boolean;
        result: any;
    }

    interface IBatchData {
        success: boolean;
        result: any;
        origin?: IOriginData;
    }

    interface IBatchStat {
        total: number;
        succeeded: number;
        failed: number;
        duration: number;
    }

    interface IStreamReadOptions {
        closable?: boolean;
        readChunks?: boolean;
        readSize?: number;
    }

    interface IStreamReadResult {
        calls: number;
        reads: number;
        length: number;
        duration: number;
    }

    interface IPageResult {
        pages: number;
        total: number;
        duration: number;
    }

    interface ISequenceResult {
        total: number;
        duration: number;
    }

    interface IArrayExt<T> extends Array<T> {
        duration: number;
    }

    // Errors namespace
    // API: http://vitaly-t.github.io/spex/errors.html
    namespace errors {
        // API: http://vitaly-t.github.io/spex/errors.BatchError.html
        class BatchError extends Error {

            // standard error properties:
            name: string;
            message: string;
            stack: string;

            // extended properties:
            data: Array<IBatchData>;

            stat: IBatchStat;

            first: any;

            // API: http://vitaly-t.github.io/spex/errors.BatchError.html#.getErrors
            getErrors(): Array<any>;

            // API: http://vitaly-t.github.io/spex/errors.BatchError.html#.toString
            toString(): string;
        }

        // API: http://vitaly-t.github.io/spex/errors.PageError.html
        class PageError extends Error {

            // standard error properties:
            name: string;
            message: string;
            stack: string;

            // extended properties:
            error: any;
            index: number;
            duration: number;
            reason: string;
            source: any;
            dest: any;

            // API: http://vitaly-t.github.io/spex/errors.PageError.html#.toString
            toString(): string;
        }

        // API: http://vitaly-t.github.io/spex/errors.SequenceError.html
        class SequenceError extends Error {

            // standard error properties:
            name: string;
            message: string;
            stack: string;

            // extended properties:
            error: any;
            index: number;
            duration: number;
            reason: string;
            source: any;
            dest: any;

            // API: http://vitaly-t.github.io/spex/errors.SequenceError.html#.toString
            toString(): string;

        }
    }

    // API: http://vitaly-t.github.io/spex/stream.html
    interface IStream {
        // API: http://vitaly-t.github.io/spex/stream.html#.read
        read(stream: any, receiver: (index: number, data: Array<any>, delay: number) => any, options?: IStreamReadOptions): Promise<IStreamReadResult>;
    }

    // PromiseAdapter class;
    // API: http://vitaly-t.github.io/spex/PromiseAdapter.html
    class PromiseAdapter {
        constructor(create: (cb: any) => object, resolve: (data: any) => void, reject: (reason: any) => void);
    }

    // Subset of the base methods only, to be used by pg-promise
    interface ISpexBase {

        // API: http://vitaly-t.github.io/spex/global.html#batch
        batch(values: Array<any>, options?: { cb?: (index: number, success: boolean, result: any, delay: number) => any }): Promise<IArrayExt<any>>;

        // API: http://vitaly-t.github.io/spex/global.html#page
        page(source: (index: number, data: any, delay: number) => any, options?: { dest?: (index: number, data: any, delay: number) => any, limit?: number }): Promise<IPageResult>;

        // API: http://vitaly-t.github.io/spex/global.html#sequence
        sequence(source: (index: number, data: any, delay: number) => any, options?: { dest?: (index: number, data: any, delay: number) => any, limit?: number, track?: boolean }): Promise<ISequenceResult | IArrayExt<any>>;
    }

    interface ISpex extends ISpexBase {

        // API: http://vitaly-t.github.io/spex/stream.html
        stream: IStream;

        // API: http://vitaly-t.github.io/spex/errors.html
        errors: typeof errors;
    }

}

declare function spex(promise: any): spex.ISpex;

export = spex;
