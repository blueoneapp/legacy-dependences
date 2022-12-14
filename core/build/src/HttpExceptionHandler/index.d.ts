import { LoggerContract } from '@ioc:Adonis/Core/Logger';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
/**
 * Http exception handler serves as the base exception handler
 * to handle all exceptions occured during the HTTP request
 * lifecycle and makes appropriate response for them.
 */
export declare abstract class HttpExceptionHandler {
    protected logger: LoggerContract;
    /**
     * An array of error codes that must not be reported
     */
    protected ignoreCodes: string[];
    /**
     * An array of http statuses that must not be reported. The first
     * level of filteration is on the basis of statuses and then
     * the error codes.
     */
    protected ignoreStatuses: number[];
    /**
     * An array of internal error codes to ignore
     * from the reporting list
     */
    protected internalIgnoreCodes: string[];
    /**
     * Map of status pages to render, instead of making the
     * regular response
     */
    protected statusPages: {
        [key: string]: string;
    };
    /**
     * Map of status pages for after expanding the expressions
     * defined inside statusPages.
     *
     * This property is initialized using the getter defined at
     * the end of this file
     */
    expandedStatusPages: {
        [key: string]: string;
    };
    /**
     * A flag to disable status pages during development
     */
    protected disableStatusPagesInDevelopment: boolean;
    constructor(logger: LoggerContract);
    /**
     * A custom context to send to the logger when reporting
     * errors.
     */
    protected context(ctx: HttpContextContract): any;
    /**
     * Returns a boolean telling if a given error is supposed
     * to be logged or not
     */
    protected shouldReport(error: any): boolean;
    /**
     * Makes the JSON response, based upon the environment in
     * which the app is runing
     */
    protected makeJSONResponse(error: any, ctx: HttpContextContract): Promise<void>;
    /**
     * Makes the JSON API response, based upon the environment in
     * which the app is runing
     */
    protected makeJSONAPIResponse(error: any, ctx: HttpContextContract): Promise<void>;
    /**
     * Makes the HTML response, based upon the environment in
     * which the app is runing
     */
    protected makeHtmlResponse(error: any, ctx: HttpContextContract): Promise<void>;
    /**
     * Report a given error
     */
    report(error: any, ctx: HttpContextContract): void;
    /**
     * Handle exception and make response
     */
    handle(error: any, ctx: HttpContextContract): Promise<any>;
}
