"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionHandler = void 0;
/**
 * Http exception handler serves as the base exception handler
 * to handle all exceptions occured during the HTTP request
 * lifecycle and makes appropriate response for them.
 */
class HttpExceptionHandler {
    constructor(logger) {
        this.logger = logger;
        /**
         * An array of error codes that must not be reported
         */
        this.ignoreCodes = [];
        /**
         * An array of http statuses that must not be reported. The first
         * level of filteration is on the basis of statuses and then
         * the error codes.
         */
        this.ignoreStatuses = [400, 422, 401];
        /**
         * An array of internal error codes to ignore
         * from the reporting list
         */
        this.internalIgnoreCodes = ['E_ROUTE_NOT_FOUND'];
        /**
         * Map of status pages to render, instead of making the
         * regular response
         */
        this.statusPages = {};
        /**
         * A flag to disable status pages during development
         */
        this.disableStatusPagesInDevelopment = true;
    }
    /**
     * A custom context to send to the logger when reporting
     * errors.
     */
    context(ctx) {
        return {
            'x-request-id': ctx.request.id(),
        };
    }
    /**
     * Returns a boolean telling if a given error is supposed
     * to be logged or not
     */
    shouldReport(error) {
        /**
         * Do not report the error when it's status is mentioned inside
         * the `ignoreStatuses` array.
         */
        if (error.status && this.ignoreStatuses.indexOf(error.status) > -1) {
            return false;
        }
        /**
         * Don't report when error has a code and it's in the ignore list.
         */
        if (error.code && this.ignoreCodes.concat(this.internalIgnoreCodes).indexOf(error.code) > -1) {
            return false;
        }
        return true;
    }
    /**
     * Makes the JSON response, based upon the environment in
     * which the app is runing
     */
    async makeJSONResponse(error, ctx) {
        if (process.env.NODE_ENV === 'development') {
            ctx.response.status(error.status).send({
                message: error.message,
                stack: error.stack,
                code: error.code,
            });
            return;
        }
        ctx.response.status(error.status).send({ message: error.message });
    }
    /**
     * Makes the JSON API response, based upon the environment in
     * which the app is runing
     */
    async makeJSONAPIResponse(error, ctx) {
        ctx.response.status(error.status).send({
            errors: [
                {
                    title: error.message,
                    ...(process.env.NODE_ENV === 'development' ? { detail: error.stack } : {}),
                    code: error.code,
                    status: error.status,
                },
            ],
        });
    }
    /**
     * Makes the HTML response, based upon the environment in
     * which the app is runing
     */
    async makeHtmlResponse(error, ctx) {
        if (process.env.NODE_ENV === 'development' &&
            (!this.expandedStatusPages[error.status] || this.disableStatusPagesInDevelopment)) {
            const Youch = require('youch');
            const html = await new Youch(error, ctx.request.request).toHTML();
            ctx.response.status(error.status).send(html);
            return;
        }
        /**
         * Render status pages
         */
        if (ctx['view'] && this.expandedStatusPages[error.status]) {
            const html = ctx['view'].render(this.expandedStatusPages[error.status], { error });
            ctx.response.status(error.status).send(html);
            return;
        }
        ctx.response.status(error.status).send(`<h1> ${error.message} </h1>`);
    }
    /**
     * Report a given error
     */
    report(error, ctx) {
        error.status = error.status || 500;
        if (!this.shouldReport(error)) {
            return;
        }
        if (typeof error.report === 'function') {
            error.report(error, ctx);
            return;
        }
        /**
         * - Using `error` for `500 and above`
         * - `warn` for `400 and above`
         * - `info` for rest. This should not happen, but technically it's possible for someone
         *    to raise with 200
         */
        const loggerFn = error.status >= 500 ? 'error' : error.status >= 400 ? 'warn' : 'info';
        this.logger[loggerFn](this.context(ctx), error.message);
    }
    /**
     * Handle exception and make response
     */
    async handle(error, ctx) {
        error.status = error.status || 500;
        if (typeof error.handle === 'function') {
            return error.handle(error, ctx);
        }
        /**
         * Attempt to find the best error reporter for validation
         */
        switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
            case 'html':
            case null:
                return this.makeHtmlResponse(error, ctx);
            case 'json':
                return this.makeJSONResponse(error, ctx);
            case 'application/vnd.api+json':
                return this.makeJSONAPIResponse(error, ctx);
        }
    }
}
exports.HttpExceptionHandler = HttpExceptionHandler;
/**
 * Single getter to pull status pages after expanding the range expression
 */
Object.defineProperty(HttpExceptionHandler.prototype, 'expandedStatusPages', {
    get() {
        const value = Object.keys(this.statusPages).reduce((result, codeRange) => {
            const parts = codeRange.split('.');
            const min = Number(parts[0]);
            const max = Number(parts[parts.length - 1]);
            if (isNaN(min) || isNaN(max)) {
                return result;
            }
            if (min === max) {
                result[codeRange] = this.statusPages[codeRange];
            }
            Array.apply(null, new Array(max - min + 1)).forEach((_, step) => {
                result[min + step] = this.statusPages[codeRange];
            });
            return result;
        }, {});
        Object.defineProperty(this, 'expandedStatusPages', { value });
        return value;
    },
});
