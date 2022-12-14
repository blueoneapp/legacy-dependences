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
exports.MiddlewareStore = void 0;
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
class MiddlewareStore {
    constructor(container) {
        /**
         * A list of global middleware
         */
        this.list = [];
        /**
         * A map of named middleware. Named middleware are used as reference
         * on the routes
         */
        this.named = {};
        this.resolver = container.getResolver();
    }
    /**
     * Resolves the middleware node based upon it's type. If value is a string, then
     * we pre-fetch it from the IoC container upfront. On every request, we just
     * create a new instance of the class and avoid re-fetching it from the IoC
     * container for performance reasons.
     *
     * The annoying part is that one has to create the middleware before registering
     * it, otherwise an exception will be raised.
     */
    resolveMiddleware(middleware) {
        return typeof middleware === 'function'
            ? {
                type: 'function',
                value: middleware,
                args: [],
            }
            : Object.assign(this.resolver.resolve(`${middleware}.handle`), { args: [] });
    }
    /**
     * Register an array of global middleware. These middleware are read
     * by HTTP server and executed on every request
     */
    register(middleware) {
        this.list = middleware.map(this.resolveMiddleware.bind(this));
        return this;
    }
    /**
     * Register named middleware that can be referenced later on routes
     */
    registerNamed(middleware) {
        this.named = Object.keys(middleware).reduce((result, alias) => {
            result[alias] = this.resolveMiddleware(middleware[alias]);
            return result;
        }, {});
        return this;
    }
    /**
     * Return all middleware registered using [[MiddlewareStore.register]]
     * method
     */
    get() {
        return this.list;
    }
    /**
     * Returns a single middleware by it's name registered
     * using [[MiddlewareStore.registerNamed]] method.
     */
    getNamed(name) {
        return this.named[name] || null;
    }
    /**
     * Invokes a resolved middleware.
     */
    async invokeMiddleware(middleware, params) {
        if (middleware.type === 'function') {
            return middleware.value(params[0], params[1], middleware.args);
        }
        const args = [params[0], params[1]];
        args.push(middleware.args);
        return this.resolver.call(middleware, undefined, args);
    }
}
exports.MiddlewareStore = MiddlewareStore;
