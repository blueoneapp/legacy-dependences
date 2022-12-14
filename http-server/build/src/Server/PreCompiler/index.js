"use strict";
/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreCompiler = void 0;
/// <reference path="../../../adonis-typings/index.ts" />
const haye_1 = __importDefault(require("haye"));
const co_compose_1 = require("co-compose");
const utils_1 = require("@poppinss/utils");
const helpers_1 = require("../../helpers");
const exceptions_json_1 = require("../../../exceptions.json");
/**
 * Precompiler is used to pre compiler the route handler and middleware. We
 * lookup the middleware and controllers upfront in the IoC container
 * and cache the lookup to boost the runtime performance.
 *
 * Also each route gets a `finalHandler` property, which is used to invoke the
 * route middleware and the route actual handler
 */
class PreCompiler {
    constructor(container, middlewareStore) {
        this.middlewareStore = middlewareStore;
        /**
         * This function is used by reference to execute the route handler
         */
        this.runRouteHandler = async (ctx) => {
            const routeHandler = ctx.route.meta.resolvedHandler;
            /*
             * Passing a child to the route handler, so that all internal
             * actions can have their own child row
             */
            let returnValue;
            if (routeHandler.type === 'function') {
                returnValue = await routeHandler.handler(ctx);
            }
            else {
                returnValue = await this.resolver.call(routeHandler, ctx.route.meta.namespace, [ctx]);
            }
            if (helpers_1.useReturnValue(returnValue, ctx)) {
                ctx.response.send(returnValue);
            }
        };
        /**
         * Method to execute middleware using the middleware store
         */
        this.executeMiddleware = (middleware, params) => {
            return this.middlewareStore.invokeMiddleware(middleware, params);
        };
        /**
         * This function is used by reference to execute the route middleware + route handler
         */
        this.runRouteMiddleware = (ctx) => {
            return new co_compose_1.Middleware()
                .register(ctx.route.meta.resolvedMiddleware)
                .runner()
                .executor(this.executeMiddleware)
                .finalHandler(this.runRouteHandler, [ctx])
                .run([ctx]);
        };
        this.resolver = container.getResolver(undefined, 'httpControllers', 'App/Controllers/Http');
    }
    /**
     * Pre-compiling the handler to boost the runtime performance
     */
    compileHandler(route) {
        if (typeof route.handler === 'string') {
            route.meta.resolvedHandler = this.resolver.resolve(route.handler, route.meta.namespace);
        }
        else {
            route.meta.resolvedHandler = { type: 'function', handler: route.handler };
        }
    }
    /**
     * Pre-compile the route middleware to boost runtime performance
     */
    compileMiddleware(route) {
        route.meta.resolvedMiddleware = route.middleware.map((item) => {
            if (typeof item === 'function') {
                return { type: 'function', value: item, args: [] };
            }
            /*
             * Extract middleware name and args from the string
             */
            const [{ name, args }] = haye_1.default.fromPipe(item).toArray();
            /*
             * Get resolved node for the given name and raise exception when that
             * name is missing
             */
            const resolvedMiddleware = this.middlewareStore.getNamed(name);
            if (!resolvedMiddleware) {
                const error = new utils_1.Exception(utils_1.interpolate(exceptions_json_1.E_MISSING_NAMED_MIDDLEWARE.message, { name }), exceptions_json_1.E_MISSING_NAMED_MIDDLEWARE.status, exceptions_json_1.E_MISSING_NAMED_MIDDLEWARE.code);
                error.help = exceptions_json_1.E_MISSING_NAMED_MIDDLEWARE.help.join('\n');
                throw error;
            }
            resolvedMiddleware.args = args;
            return resolvedMiddleware;
        });
    }
    /**
     * Sets `finalHandler` property on the `route.meta`. This method
     * can be invoked to execute route middleware stack + route
     * controller/closure.
     */
    setFinalHandler(route) {
        if (route.meta.resolvedMiddleware && route.meta.resolvedMiddleware.length) {
            route.meta.finalHandler = this.runRouteMiddleware;
        }
        else {
            route.meta.finalHandler = this.runRouteHandler;
        }
    }
    /**
     * Pre-compile route handler and it's middleware to boost runtime performance. Since
     * most of this work is repetitive, we pre-compile and avoid doing it on every
     * request
     */
    compileRoute(route) {
        this.compileHandler(route);
        this.compileMiddleware(route);
        this.setFinalHandler(route);
    }
}
exports.PreCompiler = PreCompiler;
