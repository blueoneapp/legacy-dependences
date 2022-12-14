/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../../adonis-typings/index.d.ts" />
import { IocContract } from '@adonisjs/fold';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ErrorHandler } from '@ioc:Adonis/Core/Server';
/**
 * Exception manager exposes the API to register custom error handler
 * and invoke it when exceptions are raised during the HTTP
 * lifecycle.
 */
export declare class ExceptionManager {
    private container;
    /**
     * Resolved copy of error handler
     */
    private resolvedErrorHandler?;
    /**
     * A reference to ioc resolver to resolve the error handler from
     * the IoC container
     */
    private resolver;
    constructor(container: IocContract);
    /**
     * Register a custom error handler
     */
    registerHandler(handler: ErrorHandler): void;
    /**
     * Handle error
     */
    private handleError;
    /**
     * Report error when report method exists
     */
    private reportError;
    /**
     * Handle the error
     */
    handle(error: any, ctx: HttpContextContract): Promise<void>;
}
