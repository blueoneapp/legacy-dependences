/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../adonis-typings/index.d.ts" />
import { IocContract } from '@adonisjs/fold';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { MiddlewareHandler, MiddlewareStoreContract, ResolvedMiddlewareHandler } from '@ioc:Adonis/Core/Middleware';
/**
 * Middleware store register and keep all the application middleware at one
 * place. Also middleware are resolved during the registration and any
 * part of the application can read them without extra overhead.
 *
 * @example
 * ```ts
 * const store = new MiddlewareStore()
 *
 * store.register([
 *   'App/Middleware/Auth'
 * ])
 *
 * store.registerNamed({
 *   auth: 'App/Middleware/Auth'
 * })
 *
 * store.get()
 * ```
 */
export declare class MiddlewareStore implements MiddlewareStoreContract {
    /**
     * A list of global middleware
     */
    private list;
    /**
     * A map of named middleware. Named middleware are used as reference
     * on the routes
     */
    private named;
    /**
     * The resolver to resolve middleware from the IoC container
     */
    private resolver;
    constructor(container: IocContract);
    /**
     * Resolves the middleware node based upon it's type. If value is a string, then
     * we pre-fetch it from the IoC container upfront. On every request, we just
     * create a new instance of the class and avoid re-fetching it from the IoC
     * container for performance reasons.
     *
     * The annoying part is that one has to create the middleware before registering
     * it, otherwise an exception will be raised.
     */
    private resolveMiddleware;
    /**
     * Register an array of global middleware. These middleware are read
     * by HTTP server and executed on every request
     */
    register(middleware: MiddlewareHandler[]): this;
    /**
     * Register named middleware that can be referenced later on routes
     */
    registerNamed(middleware: {
        [alias: string]: MiddlewareHandler;
    }): this;
    /**
     * Return all middleware registered using [[MiddlewareStore.register]]
     * method
     */
    get(): ResolvedMiddlewareHandler[];
    /**
     * Returns a single middleware by it's name registered
     * using [[MiddlewareStore.registerNamed]] method.
     */
    getNamed(name: string): null | ResolvedMiddlewareHandler;
    /**
     * Invokes a resolved middleware.
     */
    invokeMiddleware(middleware: ResolvedMiddlewareHandler, params: [HttpContextContract, () => Promise<void>]): Promise<void>;
}
