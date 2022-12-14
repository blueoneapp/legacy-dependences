"use strict";
/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionManager = void 0;
const helpers_1 = require("../../helpers");
/**
 * Exception manager exposes the API to register custom error handler
 * and invoke it when exceptions are raised during the HTTP
 * lifecycle.
 */
class ExceptionManager {
    constructor(container) {
        this.container = container;
        this.resolver = container.getResolver();
    }
    /**
     * Register a custom error handler
     */
    registerHandler(handler) {
        if (typeof handler === 'string') {
            this.resolvedErrorHandler = {
                type: 'class',
                value: this.container.make(this.resolver.resolve(handler)),
            };
        }
        else {
            this.resolvedErrorHandler = {
                type: 'function',
                value: handler,
            };
        }
    }
    /**
     * Handle error
     */
    async handleError(error, ctx) {
        ctx.response.safeStatus(error.status || 500);
        /*
         * Make response when no error handler has been registered
         */
        if (!this.resolvedErrorHandler) {
            ctx.response.send(error.message);
            return;
        }
        /*
         * Invoke the error handler and catch any errors raised by the error
         * handler itself. We don't expect error handlers to raise exceptions.
         * However, during development a broken error handler may raise
         * exceptions.
         */
        try {
            let value = null;
            if (this.resolvedErrorHandler.type === 'function') {
                value = await this.resolvedErrorHandler.value(error, ctx);
            }
            else {
                value = await this.container.call(this.resolvedErrorHandler.value, 'handle', [error, ctx]);
            }
            if (helpers_1.useReturnValue(value, ctx)) {
                ctx.response.send(value);
            }
        }
        catch (finalError) {
            /*
             * Unexpected block
             */
            ctx.response.status(error.status || 500).send(error.message);
            ctx.logger.fatal(finalError, 'Unexpected exception raised from HTTP ExceptionHandler "handle" method');
        }
    }
    /**
     * Report error when report method exists
     */
    async reportError(error, ctx) {
        if (this.resolvedErrorHandler &&
            this.resolvedErrorHandler.type === 'class' &&
            typeof this.resolvedErrorHandler.value['report'] === 'function') {
            try {
                await this.resolvedErrorHandler.value['report'](error, ctx);
            }
            catch (finalError) {
                ctx.logger.fatal(finalError, 'Unexpected exception raised from HTTP ExceptionHandler "report" method');
            }
        }
    }
    /**
     * Handle the error
     */
    async handle(error, ctx) {
        await this.handleError(error, ctx);
        this.reportError(error, ctx);
    }
}
exports.ExceptionManager = ExceptionManager;
