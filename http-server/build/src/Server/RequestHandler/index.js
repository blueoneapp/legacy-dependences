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
exports.RequestHandler = void 0;
/// <reference path="../../../adonis-typings/index.ts" />
const co_compose_1 = require("co-compose");
const utils_1 = require("@poppinss/utils");
const HttpException_1 = require("../../Exceptions/HttpException");
const exceptions_json_1 = require("../../../exceptions.json");
/**
 * Handles the request by invoking it's middleware chain, along with the
 * route finalHandler
 */
class RequestHandler {
    constructor(middlewareStore, router) {
        this.middlewareStore = middlewareStore;
        this.router = router;
        /**
         * Function to invoke global middleware
         */
        this.executeMiddleware = (middleware, params) => {
            return this.middlewareStore.invokeMiddleware(middleware, params);
        };
    }
    /**
     * Finds the route for the request
     */
    findRoute(ctx) {
        const url = ctx.request.url();
        const method = ctx.request.method();
        const hostname = ctx.request.hostname();
        /*
         * Profiling `route.match` method
         */
        const matchRoute = ctx.profiler.profile('http:route:match');
        const route = this.router.match(url, method, hostname || undefined);
        matchRoute.end();
        /*
         * Raise error when route is missing
         */
        if (!route) {
            throw HttpException_1.HttpException.invoke(utils_1.interpolate(exceptions_json_1.E_ROUTE_NOT_FOUND.message, { method, url }), exceptions_json_1.E_ROUTE_NOT_FOUND.status, exceptions_json_1.E_ROUTE_NOT_FOUND.code);
        }
        /*
         * Attach `params`, `subdomains` and `route` when route is found. This
         * information only exists on a given route
         */
        ctx.params = route.params;
        ctx.subdomains = route.subdomains;
        ctx.route = route.route;
        ctx.routeKey = route.routeKey;
    }
    /**
     * Handles the request and invokes required middleware/handlers
     */
    async handle(ctx) {
        this.findRoute(ctx);
        return this.handleRequest(ctx);
    }
    /**
     * Computing certain methods to optimize for runtime performance
     */
    commit() {
        const middleware = this.middlewareStore.get();
        if (!middleware.length) {
            this.handleRequest = (ctx) => ctx.route.meta.finalHandler(ctx);
            return;
        }
        this.globalMiddleware = new co_compose_1.Middleware().register(middleware);
        this.handleRequest = (ctx) => {
            return this.globalMiddleware
                .runner()
                .executor(this.executeMiddleware)
                .finalHandler(ctx.route.meta.finalHandler, [ctx])
                .run([ctx]);
        };
    }
}
exports.RequestHandler = RequestHandler;
