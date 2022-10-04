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
exports.Redirect = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const url_1 = require("url");
const qs_1 = require("qs");
const encodeurl_1 = __importDefault(require("encodeurl"));
const RouterException_1 = require("../Exceptions/RouterException");
/**
 * Exposes the API to construct redirect routes
 */
class Redirect {
    constructor(request, response, router) {
        this.request = request;
        this.response = response;
        this.router = router;
        /**
         * A boolean to forward the existing query string
         */
        this.forwardQueryString = false;
        /**
         * The status code for the redirect
         */
        this.statusCode = 302;
        /**
         * A custom query string to forward
         */
        this.queryString = {};
    }
    /**
     * Set a custom status code.
     */
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
    withQs(name, value) {
        if (typeof name === 'undefined') {
            this.forwardQueryString = true;
            return this;
        }
        if (typeof name === 'string') {
            this.queryString[name] = value;
            return this;
        }
        this.queryString = name;
        return this;
    }
    /**
     * Redirect to the previous path.
     */
    back() {
        let url = this.request.headers['referer'] || this.request.headers['referrer'] || '/';
        url = Array.isArray(url) ? url[0] : url;
        /**
         * Remove query string from the referrer
         */
        return this.toPath(url.split('?')[0]);
    }
    /**
     * Redirect the request using a route identifier.
     */
    toRoute(routeIdentifier, urlOptions, domain) {
        const url = this.router.makeUrl(routeIdentifier, urlOptions, domain);
        if (!url) {
            throw RouterException_1.RouterException.cannotLookupRoute(routeIdentifier);
        }
        return this.toPath(url);
    }
    /**
     * Redirect the request using a path.
     */
    toPath(url) {
        let query;
        // Extract the current QueryString if we want to forward it.
        if (this.forwardQueryString) {
            const { query: extractedQuery } = url_1.parse(this.request.url, false);
            query = extractedQuery;
        }
        // If we define our own QueryString, use it instead of the one forwarded.
        if (Object.keys(this.queryString).length > 0) {
            query = qs_1.stringify(this.queryString);
        }
        url = query ? `${url}?${query}` : url;
        this.response.location(encodeurl_1.default(url));
        this.response.safeStatus(this.statusCode);
        this.response.type('text/plain; charset=utf-8');
        this.response.send(`Redirecting to ${url}`);
    }
}
exports.Redirect = Redirect;
