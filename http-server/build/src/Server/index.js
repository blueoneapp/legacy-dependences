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
exports.Server = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const ms_1 = __importDefault(require("ms"));
const Hooks_1 = require("./Hooks");
const Router_1 = require("../Router");
const Request_1 = require("../Request");
const Response_1 = require("../Response");
const PreCompiler_1 = require("./PreCompiler");
const HttpContext_1 = require("../HttpContext");
const RequestHandler_1 = require("./RequestHandler");
const MiddlewareStore_1 = require("../MiddlewareStore");
const ExceptionManager_1 = require("./ExceptionManager");
/**
 * Server class handles the HTTP requests by using all Adonis micro modules.
 */
class Server {
    constructor(container, logger, profiler, encryption, httpConfig) {
        this.container = container;
        this.logger = logger;
        this.profiler = profiler;
        this.encryption = encryption;
        this.httpConfig = httpConfig;
        /**
         * The middleware store to register global and named middleware
         */
        this.middleware = new MiddlewareStore_1.MiddlewareStore(this.container);
        /**
         * The route to register routes
         */
        this.router = new Router_1.Router(this.encryption, (route) => this.precompiler.compileRoute(route));
        /**
         * Server before/after hooks
         */
        this.hooks = new Hooks_1.Hooks();
        /**
         * Precompiler to set the finalHandler for the route
         */
        this.precompiler = new PreCompiler_1.PreCompiler(this.container, this.middleware);
        /**
         * Exception manager to handle exceptions
         */
        this.exception = new ExceptionManager_1.ExceptionManager(this.container);
        /**
         * Request handler to handle request after route is found
         */
        this.requestHandler = new RequestHandler_1.RequestHandler(this.middleware, this.router);
        /*
         * Pre process config to convert max age string to seconds.
         */
        if (httpConfig.cookie.maxAge && typeof httpConfig.cookie.maxAge === 'string') {
            httpConfig.cookie.maxAge = ms_1.default(httpConfig.cookie.maxAge) / 1000;
        }
    }
    /**
     * Handles HTTP request
     */
    async handleRequest(ctx) {
        /*
         * Start with before hooks upfront. If they raise error
         * then execute error handler.
         */
        return this.hooks.executeBefore(ctx).then((shortcircuit) => {
            if (!shortcircuit) {
                return this.requestHandler.handle(ctx);
            }
        });
    }
    /**
     * Returns the profiler row
     */
    getProfilerRow(request) {
        return this.profiler.create('http:request', {
            request_id: request.id(),
            url: request.url(),
            method: request.method(),
        });
    }
    /**
     * Returns the context for the request
     */
    getContext(request, response, profilerRow) {
        return new HttpContext_1.HttpContext(request, response, this.logger.child({
            request_id: request.id(),
            serializers: {},
        }), profilerRow);
    }
    /**
     * Define custom error handler to handler all errors
     * occurred during HTTP request
     */
    errorHandler(handler) {
        this.exception.registerHandler(handler);
        return this;
    }
    /**
     * Optimizes internal handlers, based upon the existence of
     * before handlers and global middleware. This helps in
     * increasing throughput by 10%
     */
    optimize() {
        this.router.commit();
        this.hooks.commit();
        this.requestHandler.commit();
    }
    /**
     * Handles a given HTTP request. This method can be attached to any HTTP
     * server
     */
    async handle(req, res) {
        /*
         * Reset accept header when `forceContentNegotiationToJSON = true`
         */
        if (this.httpConfig.forceContentNegotiationToJSON) {
            req.headers['accept'] = 'application/json';
        }
        const request = new Request_1.Request(req, res, this.encryption, this.httpConfig);
        const response = new Response_1.Response(req, res, this.encryption, this.httpConfig, this.router);
        const requestAction = this.getProfilerRow(request);
        const ctx = this.getContext(request, response, requestAction);
        /*
         * Handle request by executing hooks, request middleware stack
         * and route handler
         */
        try {
            await this.handleRequest(ctx);
        }
        catch (error) {
            await this.exception.handle(error, ctx);
        }
        /*
         * Excute hooks when there are one or more hooks. The `ctx.response.finish`
         * is intentionally inside both the `try` and `catch` blocks as a defensive
         * measure.
         *
         * When we call `response.finish`, it will serialize the response body and may
         * encouter errors while doing so and hence will be catched by the catch
         * block.
         */
        try {
            await this.hooks.executeAfter(ctx);
            requestAction.end({ status_code: res.statusCode });
            ctx.response.finish();
        }
        catch (error) {
            await this.exception.handle(error, ctx);
            requestAction.end({ status_code: res.statusCode, error });
            ctx.response.finish();
        }
    }
}
exports.Server = Server;
