/**
 * The binding for the given module is defined inside `providers/AppProvider.ts`
 * file.
 */
declare module '@ioc:Adonis/Core/HttpExceptionHandler' {
    import { LoggerContract } from '@ioc:Adonis/Core/Logger';
    import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
    export default abstract class HttpExceptionHandler {
        constructor(logger: LoggerContract);
        protected logger: LoggerContract;
        protected ignoreCodes: string[];
        protected ignoreStatuses: number[];
        protected internalIgnoreCodes: string[];
        protected statusPages: {
            [key: string]: string;
        };
        expandedStatusPages: {
            [key: string]: string;
        };
        protected disableStatusPagesInDevelopment: boolean;
        protected context(ctx: HttpContextContract): any;
        protected shouldReport(error: any): boolean;
        protected makeJSONResponse(error: any, ctx: HttpContextContract): Promise<void>;
        protected makeJSONAPIResponse(error: any, ctx: HttpContextContract): Promise<void>;
        protected makeHtmlResponse(error: any, ctx: HttpContextContract): Promise<void>;
        report(error: any, ctx: HttpContextContract): void;
        handle(error: any, ctx: HttpContextContract): Promise<any>;
    }
}
