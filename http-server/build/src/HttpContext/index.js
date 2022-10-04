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
exports.HttpContext = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const net_1 = require("net");
const util_1 = require("util");
const proxy_addr_1 = __importDefault(require("proxy-addr"));
const macroable_1 = require("macroable");
const http_1 = require("http");
const Request_1 = require("../Request");
const Response_1 = require("../Response");
const helpers_1 = require("../helpers");
/**
 * Http context is passed to all route handlers, middleware,
 * error handler and server hooks.
 */
class HttpContext extends macroable_1.Macroable {
    constructor(request, response, logger, profiler) {
        super();
        this.request = request;
        this.response = response;
        this.logger = logger;
        this.profiler = profiler;
        this.params = {};
        this.subdomains = {};
        /*
         * Creating the circular reference. We do this, since request and response
         * are meant to be extended and at times people would want to access
         * other ctx properties like `logger`, `profiler` inside those
         * extended methods.
         */
        this.request.ctx = this;
        this.response.ctx = this;
    }
    /**
     * A helper to see top level properties on the context object
     */
    inspect() {
        return util_1.inspect(this, false, 1, true);
    }
    /**
     * Creates a new fake context instance for a given route.
     */
    static create(routePattern, routeParams, logger, profiler, encryption, router, req, res, serverConfig) {
        req = req || new http_1.IncomingMessage(new net_1.Socket());
        res = res || new http_1.ServerResponse(req);
        /*
         * Composing server config
         */
        serverConfig = Object.assign({
            secret: Math.random().toFixed(36).substring(2, 38),
            subdomainOffset: 2,
            allowMethodSpoofing: true,
            etag: false,
            generateRequestId: false,
            cookie: {},
            jsonpCallbackName: 'callback',
            trustProxy: proxy_addr_1.default.compile('loopback'),
        }, serverConfig || {});
        /*
         * Creating the url from the router pattern and params. Only
         * when actual URL isn't defined.
         */
        req.url = req.url || helpers_1.processPattern(routePattern, routeParams);
        /*
         * Creating new request instance
         */
        const request = new Request_1.Request(req, res, encryption, {
            allowMethodSpoofing: serverConfig.allowMethodSpoofing,
            subdomainOffset: serverConfig.subdomainOffset,
            trustProxy: serverConfig.trustProxy,
            generateRequestId: serverConfig.generateRequestId,
        });
        /*
         * Creating new response instance
         */
        const response = new Response_1.Response(req, res, encryption, {
            etag: serverConfig.etag,
            cookie: serverConfig.cookie,
            jsonpCallbackName: serverConfig.jsonpCallbackName,
        }, router);
        /*
         * Creating new ctx instance
         */
        const ctx = new HttpContext(request, response, logger, profiler);
        /*
         * Attaching route to the ctx
         */
        ctx.route = {
            pattern: routePattern,
            middleware: [],
            handler: async () => 'handled',
            meta: {},
        };
        /*
         * Defining route key
         */
        ctx.routeKey = `${request.method()}-${ctx.route.pattern}`;
        /*
         * Attaching params to the ctx
         */
        ctx.params = routeParams;
        return ctx;
    }
}
exports.HttpContext = HttpContext;
/**
 * Required by macroable
 */
HttpContext.macros = {};
HttpContext.getters = {};
